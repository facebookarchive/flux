#!/bin/bash

set -e

# Start in website/ even if run from root directory
cd "$(dirname "$0")"

cd ../../flux-gh-pages
git checkout -- .
git clean -dfx
git fetch
git rebase
rm -Rf *
cd ../flux/website
node server/generate.js
cp -R build/flux/* ../../flux-gh-pages/
rm -Rf build/
cd ../../flux-gh-pages
git add --all
git commit -m "update website"
git push
cd ../flux/website
