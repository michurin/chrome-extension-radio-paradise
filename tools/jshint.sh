#!/bin/sh

cd ${0%/*} &&
cd ..
jshint --verbose radio-paradise-extension/js/*.js
echo "rc=$?"
