const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message = new Discord.Message(), args) => {
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
    if (!rMember)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`Sürgüne yollanacak kişiyi etiketlemelisin ◑.◑\nÖrnek: ${ayarlar.prefix}${komutAdı} **@nick**`)
            .setColor(ayarlar.renk)
            .setTimestamp()
        );

    let aRole = message.guild.roles.cache.find(role => role.name == "Sürgün");
    if (!aRole)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`**${komutAdı}** rolünü bulamıyorum. ●︿●`)
                .setColor(ayarlar.renk)
                .setTimestamp()
        );

    if (rMember.roles.cache.has(aRole.id)) {
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`Bu kişi zaten sürgünde!`)
                .setColor(ayarlar.renk)
                .setTimestamp()
        );
    }

    await rMember.roles.set([aRole])

    await message.channel.send(new Discord.MessageEmbed()
        .setDescription(`${rMember.user} sürgüne gönderildi.`)
        .setColor(ayarlar.renk)
    );
    
};

exports.conf = {
    perms: ayarlar.perms.yetkili.filter(y => !["Dionysos"].some(r => r == y)),
    enabled: true,
    guildOnly: true,
    aliases: []
};

exports.help = {
    name: komutAdı,
    description: `Seçilen kullanıcıyı sürgüne yollar.`,
    usage: `${komutAdı} @kullanıcı`
};