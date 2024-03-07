#!/usr/bin/env sh

cd ios
rm -rf build
rm -rf Pods
rm -rf Podfile.lock
pod install
cd ..
