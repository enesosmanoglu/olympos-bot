const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");

exports.run = (client, message, args) => {

    message.delete()

    if (!message.member.voice.channelID)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${message.author}, lütfen önce bir sesli odaya katılınız.`)
            .setColor("000")
            .setTimestamp()
        ).then(msg => msg.delete({ timeout: 10000 }));

    let member = message.mentions.members.first()

    if (!member)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${ayarlar.prefix}git @kullanıcı`)
            .setColor(484848)
        ).then(msg => msg.delete({ timeout: 10000 }));


    let sesliOdadaBulunmayanlar = []
    let aynıOdadaBulunanlar = []
    let başarılı = []
    let yetkiYok = []

    //////////////////////////////////////////
    /* YETKİ SIRALAMASI KONTROLÜ BAŞLANGICI */
    //////////////////////////////////////////
    let authorMaxRoleID = 0;
    let targetMaxRoleID = 0;
    message.member.roles.cache.forEach(role => {
        if (ayarlar.perms.yetkisizAraRoller.some(r => r == role.name)) return console.log(role.name + " rolü yok sayıldı.");
        if (authorMaxRoleID < role.position)
            authorMaxRoleID = role.position
    });
    member.roles.cache.forEach(role => {
        if (ayarlar.perms.yetkisizAraRoller.some(r => r == role.name)) return console.log(role.name + " rolü yok sayıldı.");
        if (targetMaxRoleID < role.position)
            targetMaxRoleID = role.position
    });
    if (authorMaxRoleID <= targetMaxRoleID)
        yetkiYok.push(member.user.id)
    //////////////////////////////////////////
    /*    YETKİ SIRALAMASI KONTROLÜ SONU    */
    //////////////////////////////////////////

    if (yetkiYok.length == 0) {
        if (!member.voice.channelID) {
            sesliOdadaBulunmayanlar.push(member.user.id)
        }
        if (member.voice.channelID == message.member.voice.channelID)
            aynıOdadaBulunanlar.push(member.user.id)

        message.member.voice.setChannel(member.voice.channelID)
            .then(newMember => {
                başarılı.push(member.user.id)
            })
    }

    let interval = setInterval(() => {
        if (1 <= sesliOdadaBulunmayanlar.length + aynıOdadaBulunanlar.length + başarılı.length + yetkiYok.length) {
            clearInterval(interval)

            const embed = new Discord.MessageEmbed()
                .setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(`YANINA GİT`)
                .setTimestamp()

            if (başarılı.length > 0)
                embed.setColor("GREEN")
            else
                embed.setColor("RED")

            if (başarılı.length != 0)
                embed.addField("YANINA GİDİLDİ", "<@" + başarılı.join(">\n<@") + ">")
            if (aynıOdadaBulunanlar.length != 0)
                embed.addField("ZATEN AYNI ODADA", "<@" + aynıOdadaBulunanlar.join(">\n<@") + ">")
            if (sesliOdadaBulunmayanlar.length != 0)
                embed.addField("SESLİ ODADA BULUNMUYOR", "<@" + sesliOdadaBulunmayanlar.join(">\n<@") + ">")
            if (yetkiYok.length != 0)
                embed.addField("YETERSİZ YETKİ", "<@" + yetkiYok.join(">\n<@") + ">")

            message.channel.send(embed)//.then(msg => msg.delete({ timeout: 15000 }));
        }
    }, 100);
};

exports.conf = {
    perms: ayarlar.perms.yetkili,
    enabled: true,
    guildOnly: true,
    aliases: ['git']
};

exports.help = {
    name: 'git',
    description: 'Belirttiğiniz kişinin yanına gidersiniz.',
    usage: 'git kullanıcı'
};