function flip() {
  const { lang } = lora.input();
  const heads = Math.random() < 0.5;
  const count = Number(lora.kvGet("count") || 0) + 1;
  lora.kvSet("count", count);
  const text = lang === "ru" ? (heads ? "Орёл." : "Решка.") : heads ? "Heads." : "Tails.";
  return lora.reply({ speak: text, data: { heads, count } });
}

function stats() {
  const { lang } = lora.input();
  const count = Number(lora.kvGet("count") || 0);
  const text = lang === "ru" ? `Монетку бросали ${count} раз.` : `The coin was flipped ${count} times.`;
  return lora.reply({ speak: text, data: { count } });
}

module.exports = { flip, stats };
