const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");

module.exports.run = async (bot, message, args) => {
  let üyesayi = message.guild.members.cache.size;
  let botlar = message.guild.members.cache.filter(m => m.user.bot).size;
  let kullanıcılar = üyesayi - botlar;

  const embed = new Discord.MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
    .setColor(ayarlar.renk)
    .setTimestamp()
    .addField(`Anlık Kişi Sayıları`, `Çevrimiçi: **${message.guild.members.cache.filter(o => !o.user.bot && ["online", "idle", "dnd"].some(a => a == o.presence.status)).size}**
Çevrimdışı: **${message.guild.members.cache.filter(off => !off.user.bot && off.presence.status === "offline").size}** 
`, true)
    .addField("✧".repeat(9), `Toplam: **${kullanıcılar}**`)
  message.channel.send(embed);
};

module.exports.conf = {
  perms: ayarlar.perms.üst,
  enabled: true,
  guildOnly: false,
  aliases: ["anlık"]
};

module.exports.help = {
  name: "anlık",
  description: "Anlık aktiviteyi gösterir.",
  usage: "anlık"
};
