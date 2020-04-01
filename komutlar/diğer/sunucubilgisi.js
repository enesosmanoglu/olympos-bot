const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");

exports.run = (bot, message, params) => {
   const embed = new Discord.MessageEmbed()
   .setColor("RANDOM")
   .setAuthor(message.guild.name, message.guild.userURL)
   .setThumbnail(message.guild.iconURL)
   .addField('Sahip:', message.guild.owner, true)
   .addField('Toplam Üye:', `${message.guild.memberCount}`, true)
   .addField('Kanal Sayısı:', message.guild.channels.cache.size, true)
   .addField('Oluşturulma Tarihi:', message.guild.createdAt, true)
   .setFooter('Olympos Bilgileri', message.guild.iconURL)
   .setTimestamp()
   message.channel.send({embed});
 };

 exports.conf = {
    perms: ayarlar.perms.herkes,
    // => Yetkisiz komut: ["@everyone"]
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
   enabled: true,
   guildOnly: false,
   aliases: []
 };

 exports.help = {
   name: 'sunucubilgisi',
   description: 'genel bilgileri gösterir',
   usage: 'sunucubilgisi'
 }; 