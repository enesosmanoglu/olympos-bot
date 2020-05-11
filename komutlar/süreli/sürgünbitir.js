const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message = new Discord.Message(), args) => {
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
    if (!rMember)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`Sürgünden alınacak kişiyi etiketlemelisin ◑.◑`)
            .addField(`Örnek:`, `**${ayarlar.prefix}${komutAdı} <@${message.author.id}>**`)
            .setColor(ayarlar.renk)
            .setTimestamp()
        ).then(msg => msg.delete({ timeout: 15000 }));
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
    rMember.roles.cache.forEach(role => {
        if (ayarlar.perms.yetkisizAraRoller.some(r => r == role.name)) return console.log(role.name + " rolü yok sayıldı.");
        if (targetMaxRoleID < role.position)
            targetMaxRoleID = role.position
    });
    if (authorMaxRoleID <= targetMaxRoleID)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`Maalesef seçtiğin kişi yetkin dışında kalıyor (ಥ﹏ಥ)'`)
            .setColor(484848)
            .setTimestamp()
        ).then(msg => msg.delete({ timeout: 10000 }));
    //////////////////////////////////////////
    /*    YETKİ SIRALAMASI KONTROLÜ SONU    */
    //////////////////////////////////////////

    let aRole = message.guild.roles.cache.find(role => role.name == "Sürgün");
    if (!aRole)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`**Sürgün** rolünü bulamıyorum. ●︿●`)
                .setColor(ayarlar.renk)
                .setTimestamp()
        );

    if (!rMember.roles.cache.has(aRole.id)) {
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`Bu kişi zaten sürgünde değil!`)
                .setColor(ayarlar.renk)
                .setTimestamp()
        );
    }

    let kayıtsızRol = message.guild.roles.cache.find(role => role.name == "Peasant of Olympos");
    if (!kayıtsızRol)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`**Peasant of Olympos** rolünü bulamıyorum. ●︿●`)
                .setColor(ayarlar.renk)
                .setTimestamp()
        );

    await rMember.roles.set([kayıtsızRol], `${message.author.tag} |> Sürgünden çıkartıldı.`)

    let embed = new Discord.MessageEmbed()
        .setTitle(`SÜRGÜN`)
        .setDescription(`<@${rMember.user.id}> kullanıcısı <@${message.author.id}> tarafından sürgünden alındı.`)
        .setColor(ayarlar.renk)
        .setTimestamp();

    await message.channel.send(embed);

    let cezaBilgi = message.guild.channels.cache.find(c => c.name == "ceza-bilgi");
    if (cezaBilgi) cezaBilgi.send(embed);
};

exports.conf = {
    perms: ayarlar.perms.yetkili.filter(y => !["Dionysos"].some(r => r == y)),
    enabled: true,
    guildOnly: true,
    aliases: []
};

exports.help = {
    name: komutAdı,
    description: `Seçilen kullanıcıyı sürgünden alır.`,
    usage: `${komutAdı} @kullanıcı`
};