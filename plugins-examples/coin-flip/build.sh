#!/bin/sh
# Builds plugin.wasm from src/. Needs extism-js and binaryen (wasm-merge, wasm-opt) in PATH.
set -e
cd "$(dirname "$0")"
mkdir -p dist
cat src/lora.js src/index.js > dist/bundle.js
extism-js dist/bundle.js -i src/index.d.ts -o plugin.wasm
echo "plugin.wasm ready ($(wc -c < plugin.wasm | tr -d ' ') bytes)"
