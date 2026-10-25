// Each command from plugin.toml is an exported function with the same id.

function hello() {
  const { args, lang } = lora.input();
  const name = args.name || (lang === "ru" ? "друг" : "friend");
  const text = lang === "ru" ? `Привет, ${name}!` : `Hello, ${name}!`;
  lora.log(`hello → ${name}`);
  return lora.reply({ speak: text });
}

module.exports = { hello };
