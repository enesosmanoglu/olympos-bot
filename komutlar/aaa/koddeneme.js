const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar.json");
const db = require('quick.db');

exports.run = async (client, message, args) => {

    ////////////////////
    /* KOD BAŞLANGICI */
    ////////////////////  


  message.reply("ok")
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['kd'],
    perms: ayarlar.perms.kayıtlı // => Yetkisiz komut: @everyone
};

exports.help = {
    name: 'koddeneme',
    description: 'Sebep belirterek afk ol ya da afk olmaktan çık.',
    usage: 'afk sebep'
};