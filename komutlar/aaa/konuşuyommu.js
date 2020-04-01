const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {

    console.log(message.member.voice)
    message.reply(message.member.voice.speaking)

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.yetkili
};
exports.help = {
    name: komutAdı,
    description: `Günlük doğum günü kontrolünü sıfırlar.`,
    usage: `${komutAdı}`
};