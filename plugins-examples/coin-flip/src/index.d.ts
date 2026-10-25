declare module "main" {
  export function flip(): I32;
  export function stats(): I32;
}

declare module "extism:host" {
  interface user {
    log(ptr: I64): I64;
    http_request(ptr: I64): I64;
    notify(ptr: I64): I64;
    speak(ptr: I64): I64;
    kv_get(ptr: I64): I64;
    kv_set(ptr: I64): I64;
    read_clipboard(ptr: I64): I64;
    write_clipboard(ptr: I64): I64;
    run_command(ptr: I64): I64;
    get_settings(ptr: I64): I64;
    get_secret(ptr: I64): I64;
  }
}
