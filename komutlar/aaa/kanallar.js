const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const komutAdı = __filename.split("/")[__filename.split("/").length - 1].replace(".js", "")

exports.run = async (client, message, args) => {

  ////////////////////
  /* KOD BAŞLANGICI */
  ////////////////////  

  let categoryNames = [], textNames = [], voiceNames = []

  let kanallar = {}

  message.guild._sortedChannels("category").forEach(ch => {
    if (ch.type == "category") {
      categoryNames.push(ch.name)
    }
  })
  message.guild._sortedChannels("text").forEach(ch => {
    if (ch.type == "text") {
      textNames.push(ch.name)
      if (!ch.parent) {
        if (!kanallar["_nocategory"])
          kanallar["_nocategory"] = []
        return kanallar["_nocategory"].push(ch.name)
      }
      if (!kanallar[ch.parent.name])
        kanallar[ch.parent.name] = []
      kanallar[ch.parent.name].push(ch.name)
    }
  })
  message.guild._sortedChannels("voice").forEach(ch => {
    voiceNames.push(ch.name)
    if (!ch.parent) {
      if (!kanallar["_nocategory"])
        kanallar["_nocategory"] = []
      return kanallar["_nocategory"].push(ch.name)
    }
    if (!kanallar[ch.parent.name])
      kanallar[ch.parent.name] = []
    kanallar[ch.parent.name].push(ch.name)
  })

  let embed = new Discord.MessageEmbed()
    .setTitle(message.guild.name)

  Object.keys(kanallar).forEach(function (key) {
    embed.addField(key, kanallar[key].join("\n"))
  });

  message.channel.send(embed)


};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  perms: ayarlar.perms.vipüstü
};

exports.help = {
  name: komutAdı,
  description: 'Kanalları listeler.',
  usage: `${komutAdı}`
};