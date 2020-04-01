const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");

exports.run = (client, message, args) => {
 let guild = message.guild
  let rol = message.mentions.roles.first()  
  let user = message.mentions.members.first() 

  if (!user) return message.channel.send(new Discord.MessageEmbed().setDescription(`${ayarlar.prefix}rolver @kullanıcı @rol`).setColor(484848)).then(msg => msg.delete({ timeout: 10000 }));
  if (rol.length < 1) return message.channel.send(new Discord.MessageEmbed().setDescription(`${ayarlar.prefix}rolver @kullanıcı @rol`).setColor(484848)).then(msg => msg.delete({ timeout: 10000 }));
user.roles.add(rol);
  
   const embed = new Discord.MessageEmbed()
        .setDescription(`${user} kullanıcısına ${rol} rolü verildi.`)
        .setColor("000")
        .setTimestamp()
    message.channel.send({embed}).then(msg => msg.delete({ timeout: 10000 }));
};

exports.conf = {
    perms: ayarlar.perms.vipüstü,
    // => Yetkisiz komut: ["@everyone"]
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
  enabled: true,
  guildOnly: true,
  aliases: ['rolver']
};

exports.help = {
  name: 'rolver',
  description: 'Belirttiğiniz kişiye istediğiniz rolü verir.',
  usage: 'rolver kullanıcı rol'
};
