const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar.json");
const db = require('quick.db');

exports.run = async (client, message, args) => {

    let role = message.mentions.roles.first()

    if (!role)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${ayarlar.prefix}yetkiliuyarvarsayılan _@rol_ varsayılanUyarıSayısı`)
            .setColor(484848)
        ).then(msg => msg.delete({ timeout: 10000 }));

    if (args.length < 2)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${ayarlar.prefix}yetkiliuyarvarsayılan _@rol_ varsayılanUyarıSayısı`)
            .setColor(484848)
        ).then(msg => msg.delete({ timeout: 10000 }));

    ////////////////////
    /* KOD BAŞLANGICI */
    ////////////////////

    let uyarıSayısı = parseInt(args[1]);

    let db_varsayılanUyarıSayıları = new db.table("uyarıSayısı_varsayılan"); // { role.name : uyarıSayısı }
    // => Veritabanında bu komuta özel tablolar

    if (uyarıSayısı != 0)
      db_varsayılanUyarıSayıları.set(role.name, uyarıSayısı);
    else
      db_varsayılanUyarıSayıları.delete(role.name);
    

    let embed = new Discord.MessageEmbed()
          .setTitle('YETKİLİ UYARI SİSTEMİ')
          .setDescription(role + ` perminin uyarı sayısı **` + message.author + `** tarafından **` + uyarıSayısı + `** olarak ayarlandı. \n\n Varsayılan değerler:`)
          .setTimestamp()
          .setColor('BLACK')
  
  db_varsayılanUyarıSayıları.all().forEach(element => {
            embed.addField(element.ID, element.data, true)
    });
  
  message.channel.send(embed)
  
};

exports.conf = {
    perms: ["Zeus"],
    // => Yetkisiz komut: @everyone
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
    enabled: true,
    guildOnly: true,
    aliases: ['yuv','yetkili-uyarı-varsayılan']
};

exports.help = {
    name: 'yetkiliuyarıvarsayılan',
    description: 'Rollerin varsayılan uyarı değerlerini ayarlar.',
    usage: 'yetkiliuyarıvarsayılan @rol varsayılanUyarıSayısı'
};