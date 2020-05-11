const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const shortNumber = require('short-number');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {
    const guild = message.guild;
    const user = message.author;
    const userID = user.id;
    const member = message.member;

    message.react("✅")
    console.log(db.get(args[0]))
    message.reply("```json\n" + JSON.stringify(db.get(args[0])) + "```")

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