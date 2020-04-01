const discord = require("discord.js");
const ayarlar = require("/app/ayarlar");
let client;

module.exports = member => {
  client = member.guild.client;


};

function getEmoji(emojiName, defaultEmoji) {
  let emoji = client.emojis.cache.find(e => e.name == emojiName);
  if (!emoji) emoji = ":" + defaultEmoji + ":"; // Üstteki emoji bulunamazsa varsayılan emoji (discord basic emojis)
  return emoji;
}