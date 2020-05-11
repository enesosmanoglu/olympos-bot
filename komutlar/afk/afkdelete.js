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

    await console.log(db.delete(`afk_${message.guild.id}.${member.user.id}`))
    await member.setNickname(member.displayName.replace("[AFK]", ""))
    await message.channel.send(new Discord.MessageEmbed().setDescription(`<@${member.user.id}>, artık afk değil.`).setColor("GREEN"))
    if (logChannel)
        await logChannel.send(new Discord.MessageEmbed().setDescription(`<@${member.user.id}>, artık afk değil.`).setColor("GREEN"))
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.üst
};
exports.help = {
    name: komutAdı,
    description: `Birinin afksını kaldır.`,
    usage: `${komutAdı} @user`
};