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
    .then(async () => {
      message.channel.send(
        ":white_check_mark: | Yedekleme bulundu.\n:warning: | Yedekten yükleme yaparken kanallar/roller/emojiler dahil tüm bilgiler sıfırlanır ve yedekteki bilgiler yüklenir!\n\nOnaylamak için `-onayla` yazınız. (20 saniyeniz var!)"
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
      message.author.send(":white_check_mark: | Yedekten yükleme işlemi başlatılıyor!");
      backup
        .load(backupID, message.guild,{
            clearGuildBeforeRestore: true
        })
        .then(() => {
          //backup.remove(backupID);
        message.author.send("okey")
        })
        .catch(err => {
          // If an error occurenced
          return message.author.send(
            ":x: | Üzgünüm, bir hata meydana geldi... Yönetici izinlerim olduğundan emin olunuz!"
          );
        });
    })
    .catch(err => {
      return message.channel.send(
        ":x: | `" + backupID + "` kodlu bir yedek bulunamadı!"
      );
    });

  
  };

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["yedek-yükle", "backupload"],
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
