const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {

    let member = message.mentions.members.first()

    let result = member.voice.channelID;

    if (result) {
        message.reply(new Discord.MessageEmbed().setDescription(`${member.user} sesli odada bulunuyor.`).setColor("GREEN"))
    } else {
        message.reply(new Discord.MessageEmbed().setDescription(`${member.user} sesli odada bulunmuyor.`).setColor("RED"))
    }

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.yetkili
};
exports.help = {
    name: komutAdı,
    description: ``,
    usage: `${komutAdı}`
};