const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let üyesayi = message.guild.memberCount;
  let botlar = message.guild.members.cache.filter(m => m.user.bot).size;
  let kullanıcılar = üyesayi - botlar;

  const embed = new Discord.MessageEmbed()
    .setColor(`BLACK`)
    .setTimestamp()
    .addField(`\n Aktiflik`, `Çevrimiçi: **${message.guild.members.cache.filter(o => !o.user.bot && ["online", "idle", "dnd"].some(a => a == o.presence.status)).size}**
Çevrimdışı: **${message.guild.members.cache.filter(off => !off.user.bot && off.presence.status === "offline").size}** 
-----------------
Toplam: **${kullanıcılar}** 
`, true)
  message.channel.send(embed);
};

module.exports.conf = {
  perms: ["Apollo", "Artemis"],
  // => Yetkisiz komut: @everyone
  // => Sadece kayıtlılar: ["Apollo", "Artemis"]
  enabled: true,
  guildOnly: false,
  aliases: ["anlık"]
};

module.exports.help = {
  name: "anlık",
  description: "Anlık aktiviteyi gösterir.",
  usage: "anlık"
};
