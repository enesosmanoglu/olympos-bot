const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar.json");

exports.run = (client, message, args) => {

    let user = message.mentions.members.first()

    if (!user)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${ayarlar.prefix}git @kullanıcı`)
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

    message.guild.members.cache.get(message.author.id).voice.setChannel(user.voice.channelID);

    const embed = new Discord.MessageEmbed()
        .setDescription(`${message.author} kullanıcısı ${user} kullanıcısının yanına gitti.`)
        .setColor("000")
        .setTimestamp()

    message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }));
};

exports.conf = {
    perms: ayarlar.perms.vipüstü,
    // => Yetkisiz komut: @everyone
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
    enabled: true,
    guildOnly: true,
    aliases: ['git']
};

exports.help = {
    name: 'git',
    description: 'Belirttiğiniz kişinin yanına gidersiniz.',
    usage: 'git kullanıcı'
};