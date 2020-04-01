const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const Jimp = require('jimp');
const path = require('path');
const text2png = require('text2png');
const sizeOf = require('image-size');
const shortNumber = require('short-number');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {
    let newMsg;
    await message.channel.send(new Discord.MessageEmbed().setDescription("Hazırlanıyor...")).then(msg => newMsg = msg)

    let guild = message.guild;
    let member = message.member;
    let user = message.author;
    let ppURL = user.displayAvatarURL({ format: "jpg", size: 512 });

    //sıralama
    let topList = Object.values(db.get(`ranks_${guild.id}.ses`)).sort((a, b) => b.expCurrent - a.expCurrent)

    let arr = []

    let i = 1;
    topList.slice(0,10).forEach(rank => {
        arr.push(`${i++}. <@${rank.id}>\n✧ XP: \`${shortNumber(parseInt(rank.expCurrent))}/${shortNumber(parseInt(rank.expMax))}\`\n✧ Level: \`${rank.level}\``)
    });

    let embed = new Discord.MessageEmbed()
    .setTitle("Top 10 Listesi")
    .setDescription(arr.join("\n\n"))

    newMsg.edit(embed)

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.kayıtlı
};
exports.help = {
    name: komutAdı,
    description: ``,
    usage: `${komutAdı}`
};

function encode(canvas) {
    return new Promise((fulfill, reject) => {
        canvas.getBuffer(Jimp.MIME_PNG, (err, img) => err ? reject(err) : fulfill(img));
    });
}

function makeIteratorThatFillsWithColor(color) {
    return function (x, y, offset) {
        this.bitmap.data.writeUInt32BE(color, offset, true);
    }
};