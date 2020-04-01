const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");

var prefix = ayarlar.prefix;

exports.run = async (bot, message, args) => {
  let rMember =
    message.guild.member(message.mentions.users.first()) ||
    message.guild.members.cache.get(args[0]);
  if (!rMember)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `DGKO verilecek kişiyi etiketlemelisin ◑.◑\nÖrnek: ` +
            ayarlar.prefix +
            `dgko **@nick**`
        )
        .setColor(10038562)
        .setTimestamp()
    );

  let aRole = message.guild.roles.cache.find(role => role.name === '🎂  Doğum Günün Kutlu Olsun');
  if (!aRole)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`*DGKO* rolünü bulamıyorum. ●︿●`)
        .setColor("000")
        .setTimestamp()
    );

  if (rMember.roles.cache.has(aRole.id))
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription("Zaten DKGO rolüne sahip.")
        .setColor("000")
    );
  await rMember.roles.add(aRole.id);
  message.channel.send(
    new Discord.MessageEmbed()
      .setDescription(`${rMember} 🎂  Doğum günün kutlu olsun!`)
      .setColor("000")
  );
};

exports.conf = {
  perms: ["Zeus", "POSEIDON", "Hera", "Hades", "Thalia"],
  // => Yetkisiz komut: @everyone
  // => Sadece kayıtlılar: ["Apollo", "Artemis"]
  enabled: true,
  guildOnly: false,
  aliases: ["dgko"]
};

exports.help = {
  name: "dgko",
  description: "🎂  Doğum Günün Kutlu Olsun verir",
  usage: "dgko <kullanici>"
};
