const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar.json");

exports.run = (client, message, args) => {

    let user = message.mentions.members.first()

    if (!user)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${ayarlar.prefix}çek @kullanıcı`)
            .setColor(484848)
        ).then(msg => msg.delete({ timeout: 10000 }));

    if (!user.voice.channelID)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${message.author}, seçtiğiniz kullanıcı sesli odada bulunmamaktadır.`)
            .setColor("000")
            .setTimestamp()
        )

    if (!message.guild.members.cache.get(message.author.id).voice.channelID)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${message.author}, lütfen bir sesli odaya katılınız.`)
            .setColor("000")
            .setTimestamp()
        )

    if (user.voice.channelID == message.guild.members.cache.get(message.author.id).voice.channelID)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${message.author}, ${user} kullanıcısıyla zaten aynı odadasınız!`)
            .setColor("000")
            .setTimestamp()
        )

    user.voice.setChannel(message.guild.members.cache.get(message.author.id).voice.channelID);

    const embed = new Discord.MessageEmbed()
        .setDescription(`${user} kullanıcısı ${message.author} kullanıcısının yanına çekildi.`)
        .setColor("000")
        .setTimestamp()

    message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }));
};

exports.conf = {
    perms: ayarlar.perms.vipüstü,
    // => Yetkisiz komut: ["@everyone"]
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
    enabled: true,
    guildOnly: true,
    aliases: ['çek']
};

exports.help = {
    name: 'çek',
    description: 'Belirttiğiniz kişiyi yanınıza çeker.',
    usage: 'çek kullanıcı'
};