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
        ":white_check_mark: | Yedekleme bulundu.\n:warning: | Yedekten yükleme yaparken tüm geçerli rol ayarları yerine yedekteki bilgiler yüklenir!\n\nOnaylamak için `-onayla` yazınız. (20 saniyeniz var!)"
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
      message.author.send(":white_check_mark: | Yedekten rol ayarları yükleme işlemi başlatılıyor!");
    
      let data = backupInfos.data;
      
      data.roles.forEach(role => {
        let orjRol = message.guild.roles.cache.find(c=>c.name==role.name)
        if (!orjRol) return console.log("rol bulunamadı: " + role.name) // todo: yeni rol oluştur
                
        orjRol.setColor(role.color,"Yedek yükleme işlemi")
        orjRol.setHoist(role.hoist,"Yedek yükleme işlemi")
        orjRol.setMentionable(role.mentionable,"Yedek yükleme işlemi")
        orjRol.setPermissions(role.permissions,"Yedek yükleme işlemi")
        orjRol.setPosition(role.position,"Yedek yükleme işlemi")
        
      })
    
   
      
    })
    .then(()=>{
          console.log("Rol ayarlarınız güncellendi.")
      message.channel.send("Rol ayarlarınız güncellendi.")
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
  aliases: ["rol-yedek-yükle"],
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
