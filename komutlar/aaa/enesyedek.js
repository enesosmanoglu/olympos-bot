const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar.json");
const db = require('quick.db');
const komutAdı = __filename.split("/")[__filename.split("/").length - 1].replace(".js","")

exports.run = async (client, message, args) => {

    ////////////////////
    /* KOD BAŞLANGICI */
    ////////////////////  
    let yedekDb = new db.table("yedek_" + message.guild.id)
    yedekDb.get("category").forEach(channel => {
      
    })
    let sıralama = yedekDb.get("sıralama")
    console
  
    message.channel.send(sıralama)

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ["Zeus", "Athena"] // => Yetkisiz komut: @everyone
};

exports.help = {
    name: komutAdı,
    description: 'Kanalları yedekler',
    usage: `${komutAdı}`
};