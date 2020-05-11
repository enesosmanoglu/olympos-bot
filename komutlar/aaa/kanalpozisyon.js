const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const komutAdı = __filename.split("/")[__filename.split("/").length - 1].replace(".js", "")

exports.run = async (client, message, args) => {

  ////////////////////
  /* KOD BAŞLANGICI */
  ////////////////////  

  let kanallar = {}
  message.guild.channels.cache.forEach(ch => {
    if (!kanallar[ch.type])
      kanallar[ch.type] = {}
    kanallar[ch.type][ch.position] = ch.name;
  })
  console.log(kanallar)

  let text = JSON.stringify(kanallar).split(",").join("\n")
  message.channel.send(text)

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['kp'],
  perms: ayarlar.perms.üst
};

exports.help = {
  name: komutAdı,
  description: 'Kanal pozisyonlarını gösterir',
  usage: `${komutAdı}`
};