const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");

exports.run = (client, message, args) => {
let guild = message.guild
    let rol = message.mentions.roles.first()
    let user = message.mentions.members.first()

    if (!user) return message.channel.send(new Discord.MessageEmbed().setDescription(`${ayarlar.prefix}rolal @kullanıcı @rol`).setColor(10038562)).then(msg => msg.delete({ timeout: 10000 }));
    if (rol.length < 1) return message.channel.send(new Discord.MessageEmbed().setDescription(`${ayarlar.prefix}rolal @kullanıcı @rol`).setColor(10038562)).then(msg => msg.delete({ timeout: 10000 }));
    
    if (!user.roles.cache.find(r => r == rol)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${user.user} kullanıcısı ${rol} rolüne zaten **sahip değil**!`).setColor(10038562)).then(msg => msg.delete({ timeout: 10000 }));
  
    user.roles.remove(rol); 

    const embed = new Discord.MessageEmbed()
        .setDescription(`${user} kullanıcısından ${rol} rolü alındı.`)
        .setColor("000")
        .setTimestamp()
    message.channel.send({ embed }).then(msg => msg.delete({ timeout: 10000 }));
};

exports.conf = {
    perms: ayarlar.perms.vipüstü,
    // => Yetkisiz komut: ["@everyone"]
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
    enabled: true,
    guildOnly: true,
    aliases: ['rolal']
};

exports.help = {
    name: 'rolal',
    description: 'Belirtilen kişiden istediğiniz rolü alır.',
    usage: 'rolal [kullanıcı] [rol]'
};
