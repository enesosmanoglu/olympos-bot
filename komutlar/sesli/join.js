const Discord = require('discord.js');
const db = require('quick.db');
const ayarlar = require("/app/ayarlar");

module.exports.run = async (client, message, args) => {

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${message.author}, lütfen önce bir sesli odaya katılınız.`)
            .setColor("000")
            .setTimestamp()
        )
    voiceChannel.join()
        .then(() => {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription(`${message.author} beni sesli odaya soktu.`)
                .setColor("000")
                .setTimestamp()
            )
        })


}
exports.conf = {
    perms: ayarlar.perms.vipüstü,
    enabled: true,
    guildOnly: true,
    aliases: ['j']
}

exports.help = {
    name: 'join',
    description: 'Sesliye girer.',
    usage: 'join'
}
