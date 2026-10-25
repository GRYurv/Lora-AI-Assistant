# Lora plugins — developer guide

This is the English summary of [README.md](README.md) (Russian, complete). Code samples are identical.

## What a plugin is

A plugin adds commands to Lora. Every command works two ways: **without AI** (Lora matches your trigger phrases locally and offline) and **with AI** (the same command is a tool the language model can call, described by your JSON Schema).

External plugins are `plugin.wasm` files compiled from JavaScript with [extism-js](https://github.com/extism/js-pdk). They run in an Extism/wasmtime sandbox: no files, network, clipboard, or system access except through host functions that Lora checks against the permissions the user approved. A crash or an endless loop returns an error; Lora keeps running and restarts the plugin instance.

## Quick start

1. Install `extism-js` 1.6+ and binaryen (`wasm-merge`, `wasm-opt`).
2. Copy [`templates/plugin-js`](https://github.com/GRYurv/Lora-AI-Assistant/tree/main/templates/plugin-js) from [Lora-AI-Assistant](https://github.com/GRYurv/Lora-AI-Assistant), edit `src/index.js`.
3. Run `./build.sh` → `plugin.wasm`.
4. Copy the folder to the plugins folder:
   - macOS: `~/Library/Application Support/com.gryurv.lora/plugins`
   - Windows: `%APPDATA%\com.gryurv.lora\plugins`
5. In Lora, open **Settings → Plugins and MCP** and accept the external plugins warning. The plugin is picked up without a restart.
6. Test by voice ("Lora, hello plugin") or in the developer terminal: `run my-plugin.hello {"name":"Ann"}`.

## plugin.toml

Required: `id` (`a-z0-9-`), `name`, `version`, `api = 1`. Optional: `description`, `author`, `os`, `permissions`, `network` (allowed domains), `secrets`, `settings` (JSON Schema), and `[[commands]]` with `id`, `title`, `description`, `triggers`, `examples`, `args` (JSON Schema), `dangerous`.

## Trigger syntax

`word`, `[optional]`, `(a|b)` synonyms, `{name}` free text, `{n:number}` number, `{unit=a|b}` captured choice. Input is lowercased, punctuation is dropped, number words become digits, and the leading wake word is removed.

## Input and output

`lora.input()` → `{ args, lang }`. Return `lora.reply({ speak, display, data, error })`. Lora's voice is short and friendly ("Done", "Opened Spotify").

## Host API

`lora.log`, `lora.http` (`network`), `lora.notify` (`notifications`), `lora.speak`, `lora.kvGet` / `lora.kvSet`, `lora.clipboardRead` / `lora.clipboardWrite` (`clipboard`), `lora.run` (`system` for other plugins' and built-in commands), `lora.settings`, `lora.secret` (declared in `secrets`).

## Safety

No plugin is scanned or loaded before the user consents. Commands with `dangerous = true` follow **Settings → Privacy → Dangerous actions** (deny / ask / allow); a plugin's own level can't exceed the global one, and `lora.run` re-checks it.

## Limits

64 MB memory and 10 seconds per call. An empty JS plugin is about 2.5 MB.

## Publishing

Zip `plugin.toml`, `plugin.wasm`, `README.md`, `icon.png`, `locales/`; compute SHA256; open a pull request to `GRYurv/lora-plugins` adding your entry to `catalog.json`. Plugins removed from the catalog are flagged for users but never deleted automatically.

## Examples

See `plugins-examples/coin-flip` and section 16 of the Russian guide: coin flip, weather (`http_request` + settings), clipboard note, and a dangerous action with confirmation.
