const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {

    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
    if (!rMember)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`**${komutAdı}** verilecek kişiyi etiketlemelisin ◑.◑\nÖrnek: ${ayarlar.prefix}${komutAdı} **@nick**`)
            .setColor(ayarlar.renk)
            .setTimestamp()
        );

    // Rol başında bir emoji ve boşluk olmalı. // Örn: '🎤 Beatbox'
    let aRole = message.guild.roles.cache.find(role => role.name == "GÖH");
    if (!aRole)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`**${komutAdı}** rolünü bulamıyorum. ●︿●`)
                .setColor(ayarlar.renk)
                .setTimestamp()
        );

    if (rMember.roles.cache.has(aRole.id)) {
        await rMember.roles.remove(aRole.id);
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`${rMember.user} kullanıcısından **${aRole}** rolü alındı.`)
                .setColor(ayarlar.renk)
        );
    }

    await rMember.roles.add(aRole.id);

    await message.channel.send(new Discord.MessageEmbed()
        .setDescription(`${rMember.user} artık **${aRole}** rolüne sahip.`)
        .setColor(ayarlar.renk)
    );

};

exports.conf = {
    perms: ["GÖH Y"],
    enabled: true,
    guildOnly: true,
    aliases: ['göh']
};

exports.help = {
    name: komutAdı,
    description: `Seçilen kullanıcıya '${komutAdı}' rolünü verir.`,
    usage: `${komutAdı} @kullanıcı`
};