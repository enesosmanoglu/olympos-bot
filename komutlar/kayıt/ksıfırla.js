const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar.json");

var prefix = ayarlar.prefix;

exports.run = async (bot, message, args) => {
  
  let rMember =
    message.guild.member(message.mentions.users.first()) ||
    message.guild.members.get(args[0]);
  if (!rMember)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `Kaydı sıfırlanacak kişiyi etiketlemelisin ◑.◑\nÖrnek: ` +
            ayarlar.prefix +
            `ksıfırla **@nick**`
        )
        .setColor(10038562)
        .setTimestamp()
    );

  let aRole = message.guild.roles.cache.find(x => x.name === "Elite of Olympos");
  if (!aRole)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`*Elite of Olympos* rolünü bulamıyorum. ●︿●`)
        .setColor(10038562)
        .setTimestamp()
    );

  let aRole2 = message.guild.roles.cache.find(x => x.name === "Rebel of Olympos");
  if (!aRole2)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`*Rebel of Olympos* rolünü bulamıyorum. ●︿●`)
        .setColor(10038562)
        .setTimestamp()
    );

  let aRole3 = message.guild.roles.cache.find(x => x.name === "Artemis");
  if (!aRole3)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`*Artemis* rolünü bulamıyorum. ●︿●`)
        .setColor(10038562)
        .setTimestamp()
    );

  let aRole4 = message.guild.roles.cache.find(x => x.name === "Apollo");
  if (!aRole4)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`*Apollo* rolünü bulamıyorum. ●︿●`)
        .setColor(10038562)
        .setTimestamp()
    );

  let aRole5 = message.guild.roles.cache.find(x => x.name === "Peasant of Olympos");
  if (!aRole5)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`*Peasant of Olympos* rolünü bulamıyorum. ●︿●`)
        .setColor(10038562)
        .setTimestamp()
    );

  if (rMember.roles.cache.has(aRole5.id))
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription("Zaten kayıtlı değil.")
        .setColor(10038562)
    );
  await rMember.roles.add(aRole5.id);
  await rMember.roles.remove(aRole.id);
  await rMember.roles.remove(aRole2.id);
  await rMember.roles.remove(aRole3.id);
  await rMember.roles.remove(aRole4.id);
  await rMember.setNickname(null, "kayıt sıfırlama");
  await message.channel.send(
    new Discord.MessageEmbed()
      .setDescription(`${rMember} kaydı silindi.`)
      .setColor("f7cb00")
  );
};

exports.conf = {
    perms: ["Zeus", "POSEIDON", "Hera", "Hades", "Demeter", "Athena", "Ares", "Hephaistos", "Aphrodite", "Hermes", "Hestia","Dionysos"],
    // => Yetkisiz komut: @everyone
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
  enabled: true,
  guildOnly: false,
  aliases: ["ksıfırla"],
  permLevel: "0"
};

exports.help = {
  name: "kayıtsıfırla",
  description: "Yanlış kayıt edilenler için kullanılır",
  usage: "kayıtsıfırla <kullanici>"
};
