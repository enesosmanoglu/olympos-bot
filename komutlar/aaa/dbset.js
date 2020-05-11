const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const shortNumber = require('short-number');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {
    const guild = message.guild;
    const user = message.author;
    const userID = user.id;
    const member = message.member;



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