// Helpers for Lora plugins. Copy this file into your plugin's src/ folder.
// Every host function takes and returns one JSON value; these wrappers hide the memory handling.

function call(name, payload) {
  const fns = Host.getFunctions();
  const mem = Memory.fromString(JSON.stringify(payload ?? {}));
  const offset = fns[name](mem.offset);
  const text = Memory.find(offset).readString();
  const result = text ? JSON.parse(text) : {};
  if (result && result.error) throw new Error(result.error);
  return result;
}

const lora = {
  /** Input of the current command: { args, lang } */
  input() {
    const raw = Host.inputString();
    return raw ? JSON.parse(raw) : { args: {}, lang: "ru" };
  },
  /** Reply: speak — what Lora says, display — action line text, data — anything for other code. */
  reply({ speak, display, data, error } = {}) {
    Host.outputString(JSON.stringify({ speak, display: display ?? speak, data: data ?? null, error: error ?? null }));
    return 0;
  },
  log(message, level = "info") {
    call("log", { level, message: String(message) });
  },
  /** Needs the "network" permission and the domain in `network = [...]`. */
  http(url, { method = "GET", headers = {}, body } = {}) {
    return call("http_request", { url, method, headers, body });
  },
  notify(title, body) {
    call("notify", { title, body });
  },
  speak(text) {
    call("speak", { text });
  },
  kvGet(key) {
    return call("kv_get", { key }).value ?? null;
  },
  kvSet(key, value) {
    call("kv_set", { key, value: String(value) });
  },
  clipboardRead() {
    return call("read_clipboard", {}).text ?? "";
  },
  clipboardWrite(text) {
    call("write_clipboard", { text });
  },
  /** Run another Lora command; system commands need the "system" permission. */
  run(id, args = {}) {
    return call("run_command", { id, args }).result;
  },
  settings() {
    return call("get_settings", {});
  },
  /** Secrets must be declared in plugin.toml: secrets = ["api_key"]. */
  secret(name) {
    return call("get_secret", { name }).value ?? null;
  },
};
