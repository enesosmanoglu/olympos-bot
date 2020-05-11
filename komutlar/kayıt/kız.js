const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");
const db = require("quick.db")
const moment = require("moment");
moment.locale("tr");

var prefix = ayarlar.prefix;

exports.run = async (client = new Discord.Client(), message = new Discord.Message(), params) => {
    let args = []
    params.forEach(param => { if (param) args.push(param) })

    let rMember =
        message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
    if (!rMember)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(
                    `**Kaydolacak kişiyi etiketlemelisin ◑.◑**\n\n_Örnek:_ ` +
                    ayarlar.prefix +
                    `kız **@nick** isim yaş`
                )
                .setColor(10038562)
                .setTimestamp()
        );

    if (args.length < 3) {
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(
                    `**Eksik bilgi girdin ◑.◑**\n\n_Örnek:_ ` +
                    ayarlar.prefix +
                    `kız **@nick** isim yaş`
                )
                .setColor(10038562)
                .setTimestamp()
        );
    }
    if (args.length > 3) {
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(
                    `**Fazla bilgi girdin ◑.◑**\n\n_Örnek:_ ` +
                    ayarlar.prefix +
                    `kız **@nick** isim yaş`
                )
                .setColor(10038562)
                .setTimestamp()
        );
    }

    let kayıtsızRol = message.guild.roles.cache.find(e => e.name == "Peasant of Olympos");
    if (!kayıtsızRol)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`*Peasant of Olympos* rolünü bulamıyorum. ●︿●`)
                .setColor(10038562)
                .setTimestamp()
        );

    let taglıRol = message.guild.roles.cache.find(e => e.name == "Elite of Olympos");
    if (!taglıRol)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`*Elite of Olympos* rolünü bulamıyorum. ●︿●`)
                .setColor(10038562)
                .setTimestamp()
        );
    let tagsızRol = message.guild.roles.cache.find(e => e.name == "Rebel of Olympos");
    if (!tagsızRol)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`*Rebel of Olympos* rolünü bulamıyorum. ●︿●`)
                .setColor(10038562)
                .setTimestamp()
        );

    if (rMember.roles.cache.has(taglıRol.id) || rMember.roles.cache.has(tagsızRol.id))
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription("Bu kullanıcı zaten **kayıtlı**.")
                .setColor(10038562)
        );

    let isim = args[1];
    let yaş = args[2];

    if (isim.length > 12)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(
                    `İsim için harf limiti **12**'dir!`
                )
                .setColor(10038562)
                .setTimestamp()
        );

    if (!isim.match(/^[A-Za-zğĞüÜşŞıİöÖçÇ]+$/))
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(
                    `**Geçerli bir isim girilmemiş ◑.◑**\n\n_Örnek:_ ` +
                    ayarlar.prefix +
                    `kız **@nick** **isim** yaş`
                )
                .setColor(10038562)
                .setTimestamp()
        );
    if (!yaş.match(/^[0-9]+$/))
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(
                    `**Geçerli bir yaş girilmemiş ◑.◑**\n\n_Örnek:_ ` +
                    ayarlar.prefix +
                    `kız **@nick** isim **yaş**`
                )
                .setColor(10038562)
                .setTimestamp()
        );

    isim = isim.charAt(0).toUpperCase() + isim.slice(1).replace("I", "ı").toLowerCase();

    // Taglı tagsız kontrol
    let tag = "✧";
    let tag2 = "✦";
    let taglı = rMember.user.username.includes(tag);

    await rMember.setNickname(isim + " " + (taglı ? tag : tag2) + " " + yaş, "kayıt");

    let cinsiyetRol = message.guild.roles.cache.find(e => e.name == "Artemis");
    if (!cinsiyetRol)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`*Artemis* rolünü bulamıyorum. ●︿●`)
                .setColor(10038562)
                .setTimestamp()
        );

    if (rMember.roles.cache.has(cinsiyetRol.id))
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription("Bu kullanıcı zaten Artemis.")
                .setColor(10038562)
        );
    await rMember.roles.add(cinsiyetRol);

    if (taglı)
        await rMember.roles.add(taglıRol);
    else
        await rMember.roles.add(tagsızRol);

    await rMember.roles.remove(kayıtsızRol);

    rMember.tag = taglı;
    rMember.isim = isim;
    rMember.yaş = yaş;
    rMember.cinsiyet = "kız";
    await db.set(`users_${message.guild.id}.${rMember.user.id}`, rMember)

    console.log(`${rMember.user.tag} **${taglı ? "TAGLI" : "TAGSIZ"} KIZ**  olarak kaydedildi. => ${rMember.displayName}`)

    let kayıtEmbed = new Discord.MessageEmbed()
        .setDescription(`${rMember} **${taglı ? "TAGLI" : "TAGSIZ"} KIZ**  olarak kaydedildi.`)
        .setColor("d40074")
    await message.channel.send(kayıtEmbed);

    if (!db.has(`kayıtyapanlar_${message.guild.id}.${message.author.id}`))
        await db.set(`kayıtyapanlar_${message.guild.id}.${message.author.id}`, [])

    let now = moment().utcOffset(3).format('x');
    await db.push(`kayıtyapanlar_${message.guild.id}.${message.author.id}`, { member: rMember, timestamp: now })

    let kayıtLogEmbed = new Discord.MessageEmbed()
        .setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`${rMember} **${taglı ? "TAGLI" : "TAGSIZ"} KIZ**  olarak kaydedildi.`)
        .addField("Kaydettiği toplam üye sayısı:", `**${db.get(`kayıtyapanlar_${message.guild.id}.${message.author.id}`).length}**`)
        .setTimestamp()
        .setColor("d40074")
    let kayıtLog = message.guild.channels.cache.find(c => c.name == "kayıt-log")
    if (kayıtLog)
        kayıtLog.send(kayıtLogEmbed)

    let meetingCh = message.guild.channels.cache.find(g => g.name == "Meeting l");
    if (!meetingCh || meetingCh.full) meetingCh = message.guild.channels.cache.find(g => g.name == "Meeting ll");
    if (!meetingCh || meetingCh.full) meetingCh = message.guild.channels.cache.find(g => g.name == "Meeting lll");
    if (!meetingCh || meetingCh.full) return;
    if (rMember.voice.channelID) await rMember.voice.setChannel(meetingCh);
};

exports.conf = {
    perms: ["Zeus", "POSEIDON", "Hera", "Hades", "Demeter", "Athena", "Ares", "Hephaistos", "Aphrodite", "Hermes", "Hestia", "Dionysos"],
    // => Yetkisiz komut: @everyone
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
    enabled: true,
    guildOnly: false,
    aliases: ["k"]
};

exports.help = {
    name: "kız",
    description: "Kızları kayıt eder",
    usage: "kız <kullanici> isim yaş"
};
