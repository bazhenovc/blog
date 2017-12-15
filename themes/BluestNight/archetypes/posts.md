+++
title = "{{ replace .TranslationBaseName "-" " " | title }}"
date = "{{ .Date }}"{{ with $.Site.Params.author }}
author = "{{ . }}"{{ end }}
hide_authorbox = false
disable_comments = false
draft = true
+++
