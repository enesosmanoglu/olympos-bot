const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const shortNumber = require('short-number');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client = new Discord.Client(), message, args) => {

    client.users.fetch(args[0], true).then(user => {
        message.channel.send(new Discord.MessageEmbed().setAuthor(user.username, user.displayAvatarURL({ dynamic: true })).setDescription(`${user}`).setThumbnail(user.displayAvatarURL({ dynamic: true, size: 2048 })))
    })

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.üst
};
exports.help = {
    name: komutAdı,
    description: ``,
    usage: `${komutAdı}`
};