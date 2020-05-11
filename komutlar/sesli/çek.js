const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");

exports.run = (client, message, args) => {

    message.delete();

    if (!message.member.voice.channelID)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${message.author}, lütfen önce bir sesli odaya katılınız.`)
            .setColor("000")
            .setTimestamp()
        ).then(msg => msg.delete({ timeout: 10000 }));

    let members = message.mentions.members

    if (!members.size)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${ayarlar.prefix}çek @kullanıcı\n\n${ayarlar.prefix}çek @kullanıcı @kullanıcı @kullanıcı ...`)
            .setColor(484848)
        ).then(msg => msg.delete({ timeout: 10000 }));

    let sesliOdadaBulunmayanlar = []
    let aynıOdadaBulunanlar = []
    let başarılı = []
    let yetkiYok = []

    members.forEach(member => {
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
            return yetkiYok.push(member.user.id)
        //////////////////////////////////////////
        /*    YETKİ SIRALAMASI KONTROLÜ SONU    */
        //////////////////////////////////////////
        if (!member.voice.channelID) {
            return sesliOdadaBulunmayanlar.push(member.user.id)
        }
        if (member.voice.channelID == message.member.voice.channelID)
            return aynıOdadaBulunanlar.push(member.user.id)

        member.voice.setChannel(message.member.voice.channelID)
            .then(newMember => {
                başarılı.push(member.user.id)
            })
    });

    let interval = setInterval(() => {
        if (members.size <= sesliOdadaBulunmayanlar.length + aynıOdadaBulunanlar.length + başarılı.length + yetkiYok.length) {
            clearInterval(interval)

            const embed = new Discord.MessageEmbed()
                .setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(`YANINA ÇEK`)
                .setTimestamp()

            if (başarılı.length > 0)
                embed.setColor("GREEN")
            else
                embed.setColor("RED")

            if (başarılı.length != 0)
                embed.addField("YANINA ÇEKİLDİ", "<@" + başarılı.join(">\n<@") + ">")
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
    perms: ["Zeus", "POSEIDON", "Hera", "Hades", "Demeter", "Athena", "Ares", "Hephaistos", "Aphrodite", "Hermes", "Hestia"],
    enabled: true,
    guildOnly: true,
    aliases: ['çek']
};

exports.help = {
    name: 'çek',
    description: 'Belirttiğiniz kişiyi yanınıza çeker.',
    usage: 'çek kullanıcı'
};