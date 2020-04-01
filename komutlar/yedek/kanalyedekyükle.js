const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar.json");
const db = require("quick.db");
const backup = require("discord-backup");

exports.run = async (client, message, args) => {
  let backupID = args[0];
  if (!backupID) {
    return message.channel.send(":x: | Lütfen geçerli bir yedekleme kodu giriniz!");
  }
  
  backup.setStorageFolder("/app/backups/");
  backup
    .fetch(backupID)
    .then(async (backupInfos) => {
      message.channel.send(
        ":white_check_mark: | Yedekleme bulundu.\n:warning: | Yedekten yükleme yaparken tüm geçerli kanal ayarları yerine yedekteki bilgiler yüklenir!\n\nOnaylamak için `-onayla` yazınız. (20 saniyeniz var!)"
      );
      await message.channel
        .awaitMessages(
          m => m.author.id === message.author.id && m.content === "-onayla",
          {
            max: 1,
            time: 20000,
            errors: ["time"]
          }
        )
        .catch(err => {
          return message.channel.send(
            ":x: | Zaman doldu, yedekten yükleme iptal edildi!"
          );
        });
      message.author.send(":white_check_mark: | Yedekten kanal ayarları yükleme işlemi başlatılıyor!");
    
      let data = backupInfos.data;
      
      data.channels.others.forEach(other => {
        let orjCh = message.guild.channels.cache.find(c=>c.name==other.name&&c.type==other.type)
        if (!orjCh) return console.log("kanal bulunamadı: " + other.name) // todo: yeni kanal oluştur
        
        let orjPr = message.guild.channels.cache.find(c=>c.name==other.parent&&c.type=="category")
        
        orjCh.setNSFW(other.nsfw,"Yedek yükleme işlemi")
        if (orjPr) orjCh.setParent(orjPr); else orjCh.setParent(null)
        orjCh.setRateLimitPerUser(other.rateLimitPerUser,"Yedek yükleme işlemi")
        orjCh.setTopic(other.topic,"Yedek yükleme işlemi")
        
        let izinler = []
        other.permissions.forEach(perm=>{
          let rol = message.guild.roles.cache.find(r=>r.name==perm.roleName)
          izinler.push({id:rol.id,allow:perm.allow,deny:perm.deny})
        })
        while(izinler.length != other.permissions.length) {
          console.log("waiting for perms")
        }       
        orjCh.overwritePermissions(izinler, "Yedek yükleme işlemi");
      })
    
      data.channels.categories.forEach(category => {
        let orjPr = message.guild.channels.cache.find(c=>c.name==category.name&&c.type=="category")
        if (!orjPr) console.log("kategori bulunamadı: " + category.name) // todo: yeni kategori oluştur
        
        if (orjPr) {
          let izinler = []
          category.permissions.forEach(perm=>{
            let rol = message.guild.roles.cache.find(r=>r.name==perm.roleName)
            izinler.push({id:rol.id,allow:perm.allow,deny:perm.deny})
          })
          while(izinler.length != category.permissions.length) {
            console.log("waiting for perms")
          }       
          orjPr.overwritePermissions(izinler, "Yedek yükleme işlemi");
        }
        
        category.children.forEach(child => {
          
          let orjCh = message.guild.channels.cache.find(c=>c.name==child.name&&c.type==child.type)
          if (!orjCh) return console.log("kanal bulunamadı: " + child.name)
          
          if (orjPr) orjCh.setParent(orjPr)
          
          if (orjCh.type == "voice") {
            orjCh.setBitrate(child.bitrate, "Yedek yükleme işlemi")
            orjCh.setUserLimit(child.userLimit, "Yedek yükleme işlemi")
          }
          if (orjCh.type == "text") {
            orjCh.setNSFW(child.nsfw,"Yedek yükleme işlemi")
            orjCh.setRateLimitPerUser(child.rateLimitPerUser,"Yedek yükleme işlemi")
            orjCh.setTopic(child.topic,"Yedek yükleme işlemi")
          }
          
          let izinler = []
          child.permissions.forEach(perm=>{
            let rol = message.guild.roles.cache.find(r=>r.name==perm.roleName)
            izinler.push({id:rol.id,allow:perm.allow,deny:perm.deny})
          })
          while(izinler.length != child.permissions.length) {
            console.log("waiting for perms")
          }       
          orjCh.overwritePermissions(izinler, "Yedek yükleme işlemi");
          
        })
        
        
      })
    
      
    })
    .then(()=>{
          console.log("Kanal ayarlarınız güncellendi.")
      message.channel.send("Kanal ayarlarınız güncellendi.")
    })
    .catch(err => {
      console.error(err)
      return message.channel.send(
        ":x: | `" + backupID + "` kodlu bir yedek bulunamadı!"
      );
    });

  
  };

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["kanal-yedek-yükle"],
  perms: ayarlar.perms.üst // => Yetkisiz komut: @everyone
};

exports.help = {
  name: __filename
    .replace(__dirname, "")
    .replace("/", "")
    .replace(".js", ""),
  description: "",
  usage: "yedekler"
};
