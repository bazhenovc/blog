+++
title = "Unordered Map Pitfall"
date = 2017-12-15T17:54:23+03:00
draft = false
categories = [
    "Programming", "C++"
]
tags = ["C++"]
+++

std::unordered_map implementation in MSVC has a major performance issue.

<!--more-->

Let's take a closer look at it. MSVC version is 2015, other versions are probably affected as well.

<unordered_map>:

            // TEMPLATE CLASS unordered_map
    template<class _Kty,
        class _Ty,
        class _Hasher = hash<_Kty>,
        class _Keyeq = equal_to<_Kty>,
        class _Alloc = allocator<pair<const _Kty, _Ty> > >
        class unordered_map
            : public _Hash<_Umap_traits<_Kty, _Ty,
                _Uhash_compare<_Kty, _Hasher, _Keyeq>, _Alloc, false> >
        {   // hash table of {key, mapped} values, unique keys
        //
        // Irrelevant code omitted
        //
        template<class _Valty,
            class = enable_if_t<is_constructible<value_type, _Valty>::value> >
            _Pairib insert(_Valty&& _Val)
            {   // insert _Val
            return (this->emplace(_STD forward<_Valty>(_Val)));
            }

So, insert() calls this->emplace(...). Let's examine that method too:

<unordered_map>:

    template<class... _Valty>
        iterator emplace(_Valty&&... _Val)
        {   // try to insert value_type(_Val...), favoring right side
        return (_Mybase::emplace(_STD forward<_Valty>(_Val)...).first);
        }

That routes it to _Mybase::emplace. So far nothing too criminal, but let's look for that as well.

<xhash>:

            // TEMPLATE CLASS _Hash
    template<class _Traits>
        class _Hash
        {   // hash table -- list with vector of iterators for quick access
        //
        // Irrelevant code omitted
        //
        template<class... _Valty>
            _Pairib emplace(_Valty&&... _Val)
            {   // try to insert value_type(_Val...)
            _List.emplace_front(_STD forward<_Valty>(_Val)...);
            return (_Insert(_List.front(), _Unchecked_begin()));
            }

Oh wait, what's that?

    typedef std::list<...> _Mylist;
    _Mylist _List;  // list of elements, must initialize before _Vec

std::unordered_map uses std::list internally. Let's take a look at its methods as well:

<list>:
        template<class... _Valty>
            void emplace_front(_Valty&&... _Val)
            {   // insert element at beginning
            _Insert(_Unchecked_begin(), _STD forward<_Valty>(_Val)...);
            }
        template<class... _Valty>
            void _Insert(_Unchecked_const_iterator _Where,
            _Valty&&... _Val)
            {   // insert element at _Where
            _Nodeptr _Pnode = _Where._Mynode();
            _Nodeptr _Newnode =
                this->_Buynode(_Pnode, this->_Prevnode(_Pnode),     /// We're interested in this one
                    _STD forward<_Valty>(_Val)...);
            // Irrelevant code omitted
            }
        // _Buynode
        template<class... _Valty>
        _Nodeptr _Buynode(_Nodeptr _Next, _Nodeptr _Prev,
            _Valty&&... _Val)
            {   // allocate a node and set links and value
            _Nodeptr _Pnode = this->_Buynode0(_Next, _Prev);        /// It calls _Buynode0
            // Irrelevant code omitted
            }
        // _Buynode0
        _Nodeptr _Buynode0(_Nodeptr _Next,
        _Nodeptr _Prev)
            {   // allocate a node and set links
            _Nodeptr _Pnode = _Getal().allocate(1);
            // Irrelevant code omitted
            }

Here we go. _Buynode0 ALWAYS makes a small memory allocation for 1 element, thus in MSVC std::list ALWAYS allocates memory every single time something is inserted into it, thus std::unordered_map ALWAYS allocates memory when new element is successfully inserted into it.

I hope that I don't need to explain how bad this is: heap allocations are slow, also this may produce high memory fragmentation. Not to mention that this single allocation is a few times slower then the actual insert() call.

Thanks for reading!