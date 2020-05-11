const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args) => {
    
    ////////////////////
    /* KOD BAŞLANGICI */
    ////////////////////

    let db_uyarıSayısı = new db.table("uyarıSayısı"); // { user.id : uyarıSayısı }

    db_uyarıSayısı.all().forEach(uyarı => {
        let silindiMi = db_uyarıSayısı.delete(uyarı.ID);

        if (!silindiMi)
            return message.channel.send("<@" + uyarı.ID + "> kullanıcısının uyarıları silinirken hata ile karşılaşıldı.")
    });
  
  
    // HAREKETLİ EMOJİ
    let gifemoji = message.guild.client.emojis.cache.find(emoji => emoji.name === 'ZilGif') ? message.guild.client.emojis.cache.find(emoji => emoji.name === 'ZilGif') : `:fire:`

    message.channel.send(new Discord.MessageEmbed()
          .setTitle(`${gifemoji} YETKİLİLERE AF ${gifemoji}`)
          .setDescription(`Tüm yetkililerin uyarıları sıfırlandı. ┌(メ▼▼)┘`)
          .setImage("https://i.hizliresim.com/glVmIZ.gif")
          .setTimestamp()
          .setColor('BLACK'))
  
    let yetkiliUyarıCh = message.guild.channels.cache.find(channel => channel.name === 'yetkili-uyarı');
    if (yetkiliUyarıCh)
        yetkiliUyarıCh.send(new Discord.MessageEmbed()
          .setTitle(`${gifemoji} YETKİLİLERE AF ${gifemoji}`)
          .setDescription(`Tüm yetkililerin uyarıları sıfırlandı. ┌(メ▼▼)┘`)
          .setImage("https://i.hizliresim.com/glVmIZ.gif")
          .setTimestamp()
          .setColor('BLACK'))

};

exports.conf = {
    perms: ["Zeus", "POSEIDON", "Hera", "Hades"],
    // => Yetkisiz komut: @everyone
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
    enabled: true,
    guildOnly: true,
    aliases: ['yaf','yetkili-af'],
};

exports.help = {
    name: 'yetkiliaf',
    description: 'Yetkililerin tüm uyarılarını affeder.',
    usage: 'yetkiliaf'
};