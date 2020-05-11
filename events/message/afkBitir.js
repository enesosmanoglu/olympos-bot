const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const moment = require("moment");
moment.locale("tr");
const fs = require("fs");


module.exports = async message => {

    if (message.author.bot) return;

    let logChannel = message.guild.channels.cache.find(c => c.name == "afk-logs")

    if (message.member.displayName.includes("[AFK]") && db.has(`afk_${message.guild.id}.${message.author.id}`)) {
        // ÖNCEDEN AFK
        await db.delete(`afk_${message.guild.id}.${message.author.id}`)
        await message.member.setNickname(message.member.displayName.replace("[AFK]", ""))
        await message.channel.send(new Discord.MessageEmbed().setDescription(`<@${message.author.id}>, artık afk değil.`).setColor("GREEN"))
        if (logChannel)
            await logChannel.send(new Discord.MessageEmbed().setDescription(`<@${message.author.id}>, artık afk değil.`).setColor("GREEN"))
    }

}