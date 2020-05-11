const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");
const db = require("quick.db");
const moment = require("moment");

exports.run = async (client, message, args) => {
    let user = message.mentions.members.first();

    if (!user)
        return message.channel
            .send(
                new Discord.MessageEmbed()
                    .setDescription(
                        `Örnek: **${ayarlar.prefix}sesmute @kullanıcı 10 sebep**`
                    )
                    .setColor(484848)
            )
            .then(msg => msg.delete({ timeout: 10000 }));

    //

    if (args.length < 3)
        return message.channel
            .send(
                new Discord.MessageEmbed()
                    .setDescription(
                        `Örnek: **${ayarlar.prefix}sesmute @kullanıcı 10 sebep**`
                    )
                    .setColor(484848)
            )
            .then(msg => msg.delete({ timeout: 10000 }));

    let sure = args[1];
    if (!sure.match(/^[0-9.\b]+$/) || parseFloat(sure) == 0)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(
                    `**Geçerli bir süre girilmemiş ◑.◑**\n\n_Örnek:_ ` +
                    ayarlar.prefix +
                    `sesmute **@nick** süre(sadeceSayı) sebep`
                )
                .setColor(10038562)
                .setTimestamp()
        );
    sure = parseFloat(sure)
    let sebep = args.slice(2, args.length).join(" ");

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

    //////////////////////////////////////////
    /*    YETKİ SIRALAMASI KONTROLÜ SONU    */
    //////////////////////////////////////////

    user.voice.setMute(true).catch(err => { });

    let süreliDb = new db.table("sesmute");
    await süreliDb.set(user.id + ".cezaBitis", parseInt(moment().format("x")) + sure * 60 * 1000)
    await süreliDb.set(user.id + ".msgChID", message.channel.id);


    let tooRooms = message.guild.channels.cache.filter(c => c.name.includes("Town of Olympos"))
    tooRooms.forEach(async tooRoom => {
        await tooRoom.updateOverwrite(user.id, {
            CONNECT: false
        });
    });


    /*
      setTimeout(() => {
          user.setMute(false);
      }, sure * 60 * 1000)
      */

    let embed = new Discord.MessageEmbed()
        .setTitle(`🔒 SESLİ MUTE`)
        .setDescription(
            `<@${user.id}> kullanıcısı <@${message.author.id}> tarafından **` +
            sure +
            ` dakika** susturuldu.\n\n**SEBEP: **_` +
            sebep +
            `_`
        )
        .setColor("000")
        .setTimestamp();

    message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }));

    let cezaBilgi = message.guild.channels.cache.find(c => c.name == "ceza-bilgi");

    if (cezaBilgi) cezaBilgi.send(embed);
};

exports.conf = {
    perms: ayarlar.perms.yetkili,
    enabled: true,
    guildOnly: true,
    aliases: ["sesmute"],
};

exports.help = {
    name: "sesmute",
    description: "Belirttiğiniz kişinin sesini sunucuda kapatır.",
    usage: "sesmute kullanıcı süre sebep"
};
