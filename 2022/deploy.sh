#!/usr/bin/env sh

# abort on errors
set -e

npm run build

cp -r ./dist/** ../gh-page/

cd ../gh-page

git add -A

git commit -m "deploy"

git push origin main:main

cd -