#!/usr/bin/env sh

cd android
./gradlew clean
cd ..
rm -rf ./android/app/build
rm -rf ./android/.gradle
rm -rf ./android/.idea
rm -rf ./android/app/.cxx
rm -rf node_modules
rm -rf yarn.lock
