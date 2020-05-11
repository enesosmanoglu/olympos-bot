const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const backup = require('discord-backup')

exports.run = async (client, message, args) => {
  // Create the backup
  
  let logChannel = message.guild.channels.cache.find(g => g.name == "backup-log")
  let logMessage;
  if (logChannel) logChannel.send(new Discord.MessageEmbed().setTitle("Özel yedekleme işlemi başlatılıyor...").setColor("RANDOM").setTimestamp()).then(msg=>logMessage=msg) 

  backup.setStorageFolder("/app/backups/");
    backup
      .create(message.guild, { 
        maxMessagesPerChannel: 0,
        jsonSave: true,
        jsonBeautify: true,
        saveImages: "url"
      })
      .then(backupData => {
        if (logMessage) logMessage.edit(new Discord.MessageEmbed().setTitle("Özel yedekleme tamamlandı.").addField("Yedekleme kodu",backupData.id,true).setColor("RANDOM").setTimestamp())
        db.set(`backup.last_${message.guild.id}.data`,backupData)
        console.log("Yedekleme tamamlandı.")
      })
      .catch(err => {
        console.error(err)
      })
    
  

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['yedek-oluştur','yedekle'],
    perms: ayarlar.perms.üst // => Yetkisiz komut: @everyone
};

exports.help = {
    name: 'yedekoluştur',
    description: '',
    usage: 'yedekoluştur'
};