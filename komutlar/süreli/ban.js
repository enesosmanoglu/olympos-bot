const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");
const db = require("quick.db");
const moment = require("moment");

exports.run = async (client, message, args) => {

    if (db.has(`lastBanTimestamp_${message.guild.id}`) && moment().format("x") < (db.get(`lastBanTimestamp_${message.guild.id}`) + (1000 * 15))) {
        return message.reply("Bu komutu kullanabilmek için " + ((db.get(`lastBanTimestamp_${message.guild.id}`) + (1000 * 15)) - moment().format("x")) / 1000 + " saniye beklemeniz gerekmektedir.")
    }
 
    let user = message.mentions.members.first();

    if (!user)
        return message.channel
            .send(
                new Discord.MessageEmbed()
                    .setDescription(
                        `Örnek: **${ayarlar.prefix}ban @kullanıcı sebep**`
                    )
                    .setColor(484848)
            )
            .then(msg => msg.delete({ timeout: 10000 }));

    //

    if (args.length < 2)
        return message.channel
            .send(
                new Discord.MessageEmbed()
                    .setDescription(
                        `Örnek: **${ayarlar.prefix}ban @kullanıcı sebep**`
                    )
                    .setColor(484848)
            )
            .then(msg => msg.delete({ timeout: 10000 }));

    let sure = 30;
    let sebep = args.slice(1, args.length).join(" ");

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

    if (!user.bannable)
        return message.reply("Bu kişiyi banlayamıyorum.")

    // ban a guild member
    user.ban({ reason: sebep })
        .then(async mem => {

            mem.send(new Discord.MessageEmbed().setTitle("BANLANDINIZ!").setDescription("Olympos'tan 30 gün banlandınız.").addField("BANLANMA SEBEBİ", sebep).setColor(ayarlar.renk))
            db.set(`lastBanTimestamp_${message.guild.id}`, moment().format("x"))

            let süreliDb = new db.table("ban");
            await süreliDb.set(user.id + ".cezaBitis", parseInt(moment().format("x")) + sure * 60 * 1000 * 60 * 24)
            await süreliDb.set(user.id + ".msgChID", message.channel.id);
            await süreliDb.set(user.id + ".cezaVerenID", message.author.id);

            let embed = new Discord.MessageEmbed()
                .setTitle(`🔒 BAN`)
                .setDescription(`<@${user.id}> kullanıcısı <@${message.author.id}> tarafından banlandı.\n\n**SEBEP: **_` + sebep + `_`)
                .setColor("000")
                .setTimestamp();

            message.channel.send(embed)//.then(msg => msg.delete({ timeout: 10000 }));

            let cezaBilgi = message.guild.channels.cache.find(c => c.name == "ceza-bilgi");

            if (cezaBilgi) cezaBilgi.send(embed);
        })
        .catch(console.error);

};

exports.conf = {
    perms: ayarlar.perms.vipüstü,
    enabled: true,
    guildOnly: true,
    aliases: ["ban"],
};

exports.help = {
    name: "ban",
    description: "Belirttiğiniz kişiyi sunucuda yasaklar.",
    usage: "ban kullanıcı sebep"
};
