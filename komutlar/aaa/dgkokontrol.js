const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {

    message.reply(db.delete(`dg.last_${message.guild.id}.day`))

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