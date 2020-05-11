const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("/app/ayarlar");
const backup = require("discord-backup");
const moment = require("moment");

module.exports = client => {
  
    const guild = client.guilds.cache.find(g=>g.id == ayarlar.sunucu);
    if (!guild) return console.error("Ana sunucu bulunamadı! (ayarlar.sunucu). Oto yedekleme yapılamayacaktır.")
    
    //console.log(moment().utcOffset(3).format("HHmmss"))  
    
    setInterval(()=>{ 
      if (parseInt(moment().utcOffset(3).format("HHmmss")) >= parseInt("030000") && db.get(`backup.last_${guild.id}.day`) != moment().utcOffset(3).format("DD")) { // Her gün saat 3:00 'te backup
        db.set(`backup.last_${guild.id}.day`,moment().utcOffset(3).format("DD"))
        
        console.log("Yedekleme başlıyor.")
        
        let logChannel = guild.channels.cache.find(g => g.name == "backup-log")
        let logMessage;
        if (logChannel) logChannel.send(new Discord.MessageEmbed().setTitle("Günlük yedekleme işlemi başlatılıyor...").setColor("RANDOM").setTimestamp()).then(msg=>logMessage=msg) 
        
        backup.setStorageFolder("/app/backups/");
          backup
            .create(guild, { 
              maxMessagesPerChannel: 0,
              jsonSave: true,
              jsonBeautify: true,
              saveImages: "base64"
            })
            .then(backupData => {
              if (logMessage) logMessage.edit(new Discord.MessageEmbed().setTitle("Günlük yedekleme tamamlandı.").addField("Yedekleme kodu",backupData.id,true).setColor("RANDOM").setTimestamp())
              db.set(`backup.last_${guild.id}.data`,backupData)
              console.log("Yedekleme tamamlandı.")
            })
            .catch(err => {
              console.error(err)
            })
        
      }
    },1000)

    //db.push(`backup.all_${guild.id}`,newBackup)
    //db.set(`backup.last_${guild.id}`,newBackup)

  };
