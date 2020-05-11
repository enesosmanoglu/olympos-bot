const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const moment = require("moment")
moment.locale("tr")

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {


    let logChannel = message.guild.channels.cache.find(c => c.name == "afk-logs")

    // yeni afk oluyor

    let member = message.mentions.members.first()

    if (!member)
        return message.reply("Lütfen birini etiketleyiniz.")

    args.shift()

    let sebep = args.join(" ");

    if (!sebep)
        return message.reply("Lütfen sebep belirtiniz.")

    await console.log(db.set(`afk_${message.guild.id}.${member.user.id}`, { id: member.user.id, sebep: sebep, timestamp: moment().utcOffset(3).format('x') }))
    await member.setNickname("[AFK] " + member.displayName.replace("[AFK]", ""))
    await message.channel.send(new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true })).setDescription(`<@${member.user.id}>, ${sebep} sebebiyle afk yapıldı.`).setColor("RED"))
    if (logChannel)
        await logChannel.send(new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true })).setDescription(`<@${member.user.id}>, ${sebep} sebebiyle afk yapıldı.`).setColor("RED"))

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.üst
};
exports.help = {
    name: komutAdı,
    description: `Birini afk yap.`,
    usage: `${komutAdı} sebep`
};