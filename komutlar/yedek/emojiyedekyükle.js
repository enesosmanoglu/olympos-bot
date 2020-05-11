const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");
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
        ":white_check_mark: | Yedekleme bulundu.\n:warning: | Yedekten yükleme yaparken geçerli emojiler yerine yedekteki emojiler yüklenir!\n\nOnaylamak için `-onayla` yazınız. (20 saniyeniz var!)"
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
      await message.author.send(":white_check_mark: | Yedekten emoji yükleme işlemi başlatılıyor!");
    
      let data = backupInfos.data;
      
      await message.guild.emojis.cache.forEach(async emj=>await emj.delete())
    
      await data.emojis.forEach(async emoji => {
        await message.guild.emojis.create((emoji.base64 ? emoji.base64 : emoji.url), emoji.name)
      })
    
      await console.log("Emojleriniz güncellendi.")
      await message.channel.send("Emojleriniz güncellendi.")
      
    })
    .then(()=>{
          console.log("asd")
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
  aliases: ["emoji-yedek-yükle"],
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
