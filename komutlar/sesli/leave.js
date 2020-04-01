const Discord = require('discord.js');
const db = require('quick.db');
const ayarlar = require("/app/ayarlar.json");

exports.run = async (client, message, args) => {
    if (!message.guild.members.cache.find(m => m.id == client.user.id).voice.channel) return message.channel.send("Seslide değilim.");
    if (!message.member.voice.channel) return message.channel.send("Seslide değilsin..");
    if (message.member.voice.channelID != message.guild.members.cache.find(m => m.id == client.user.id).voice.channelID) return message.channel.send("Aynı odada değiliz...");  
    message.member.voice.channel.leave();
};
  
  exports.conf = {
    perms: ayarlar.perms.vipüstü,
    enabled: true,
    guildOnly: true,
    aliases: ['l']
  };
  
  exports.help = {
    name: "leave",
    description: "Sesliden çıkar.",
    usage: "leave",
  };
