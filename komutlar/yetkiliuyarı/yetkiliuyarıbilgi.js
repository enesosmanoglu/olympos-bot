const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

exports.run = async (client, message, args) => {


    let user = message.mentions.members.first()
    let role = message.mentions.roles.first()

    if (!user) {
        if (!role)
            return message.channel.send(new Discord.MessageEmbed()
                .setDescription(`${ayarlar.prefix}yetkiliuyarıbilgi _@kullanıcı_`)
                .setColor(484848)
            ).then(msg => msg.delete({ timeout: 10000 }));
        else {
            let db_varsayılanUyarıSayıları = new db.table("uyarıSayısı_varsayılan"); // { role.name : uyarıSayısı }
            let varsayılan = db_varsayılanUyarıSayıları.get(role.name);
            return message.reply(new Discord.MessageEmbed()
                .setDescription(`<@&${role.id}> rolünün varsayılan uyarı hakkı sayısı: ${varsayılan}`)
                .setColor(484848)
            ).then(msg => msg.delete({ timeout: 10000 }));
        }
    }


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

    user.roles.cache.forEach(role => {
        if (ayarlar.perms.yetkisizAraRoller.some(r => r == role.name)) return console.log(role.name + " rolü yok sayıldı.");
        if (targetMaxRoleID < role.position)
            targetMaxRoleID = role.position
    });

    if (authorMaxRoleID <= targetMaxRoleID)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`Maalesef seçtiğin kişiye bu komutu uygulayamazsın (ಥ﹏ಥ)'`)
            .setColor(484848)
            .setTimestamp()
        ).then(msg => msg.delete({ timeout: 10000 }));

    ///////////////////////////////////////
    /*    YETKİ SIRALAMASI KONTROLÜ SONU    */
    //////////////////////////////////////////

    ////////////////////
    /* KOD BAŞLANGICI */
    ////////////////////

    let db_uyarıSayısı = new db.table("uyarıSayısı"); // { user.id : uyarıSayısı }

    let userUyarıSayısı;
    // => Kişinin sahip olduğu maksimum uyarı sayısı


    if (db_uyarıSayısı.has(user.id)) {
        userUyarıSayısı = db_uyarıSayısı.get(user.id);
    } else {
        // => Adam temiz çıktı aga
        return message.reply(`<@${user.id}> kullanıcısının hiç uyarısı yok!`);
    }

    message.channel.send(new Discord.MessageEmbed()
        .setTitle('YETKİLİ UYARI SİSTEMİ')
        .setDescription(`<@${user.id}> yetkilisi **` + userUyarıSayısı + ` uyarı hakkına** sahip.`)
        .setTimestamp()
        .setColor('BLACK'))

};
exports.conf = {
    perms: ["Zeus", "POSEIDON", "Hera", "Hades", "Demeter", "Athena", "Ares", "Hephaistos", "Aphrodite", "Hermes", "Hestia", "Dionysos"],
    // => Yetkisiz komut: ["@everyone"]
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
    enabled: true,
    guildOnly: true,
    aliases: ['yub', 'yetkili-uyarı-bilgi']
};

exports.help = {
    name: 'yetkiliuyarıbilgi',
    description: 'Belirttiğiniz kişinin mevcut uyarısı sayısını ya da rolün varsayılan değerini gösterir.',
    usage: 'yetkiliuyarıbilgi kullanıcı/rol'
};