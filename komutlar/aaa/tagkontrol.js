const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar.json");
const db = require('quick.db');

exports.run = async (client, message, args) => {

    ////////////////////
    /* KOD BAŞLANGICI */
    ////////////////////  

  

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['tagk','tag-kontrol'],
    perms: ["Zeus", "POSEIDON"] // => Yetkisiz komut: @everyone
};

exports.help = {
    name: 'tagkontrol',
    description: 'Herkesin tag-rol eşleşmesini kontrol eder.',
    usage: 'tagkontrol'
};