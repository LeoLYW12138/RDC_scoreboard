#!/usr/bin/env sh

# abort on errors
set -e

npm run build

cp -r ./dist/** ../gh-page/

git add -A

git commit -m "deploy"

git push --recurse-submodules=only