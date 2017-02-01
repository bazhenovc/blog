#!/bin/sh

git commit -a -m 'publish'

if [[ $(git status -s) ]]
then
    echo "The working directory is dirty. Please commit any pending changes."
    exit 1;
fi

echo "Deleting old publication"
rm -rf public
mkdir public
git worktree prune
rm -rf .git/worktrees/public/

echo "Checking out gh-pages branch into public"
git worktree add -B gh-pages public remotes/origin/gh-pages

echo "Removing existing files"
rm -rf public/*

echo "Generating site"
D:/tmp/hugo/hugo.exe --theme=hugo_theme_beg

echo "Updating gh-pages branch"
cd public && git add --all && git commit -m "Publishing to gh-pages (publish.sh)"
cd ..
git push && git push origin gh-pages