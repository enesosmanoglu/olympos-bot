const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");

var prefix = ayarlar.prefix;

exports.run = async (bot, message, args) => {
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if (!rMember) return message.channel.send(new Discord.MessageEmbed().setDescription(`Silinecek kişiyi etiketlemelisin ◑.◑\nÖrnek: ` + ayarlar.prefix + `dgkosil **@nick**`).setColor(10038562).setTimestamp())

    let aRole = message.guild.roles.cache.find(role => role.name === '🎂  Doğum Günün Kutlu Olsun')
    if (!aRole) return message.channel.send(new Discord.MessageEmbed().setDescription(`*DGKO* rolünü bulamıyorum. ●︿●`).setColor(10038562).setTimestamp())
  
  
	await (rMember.roles.remove(aRole.id))
    message.channel.send(new Discord.MessageEmbed().setDescription(`${rMember} 🎂  Geçmiş doğum günün kutlu olsun!`).setColor('000'))

};

exports.conf = {
    perms: ["Zeus", "POSEIDON", "Hera", "Hades","Thalia"],
    // => Yetkisiz komut: @everyone
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
  enabled: true,
  guildOnly: false,
  aliases: [],
};

exports.help = {
  name: "dgkosil",
  description: "DGKO rolünü siler",
  usage: "dgkosil <kullanici>"
};
