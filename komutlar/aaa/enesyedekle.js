const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar.json");
const db = require('quick.db');
const komutAdı = __filename.split("/")[__filename.split("/").length - 1].replace(".js","")

exports.run = async (client, message, args) => {
let category = [], text = [], voice = []
  let categoryNames = [], textNames = [], voiceNames = []
  
  let kanallar = {}

  message.guild._sortedChannels("category").forEach(ch => {
    if (ch.type == "category") {
      category.push(ch)
      categoryNames.push(ch.name)
    }
  })
  message.guild._sortedChannels("text").forEach(ch => {
    if (ch.type == "text") {
      text.push(ch)
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
    voice.push(ch)
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
    //.addField("category", categoryNames.join("\n"), true)
    //.addField("text", textNames.join("\n"), true)
    //.addField("voice", voiceNames.join("\n"), true)
  
  Object.keys(kanallar).forEach(function(key) {
    embed.addField(key, kanallar[key].join("\n"))
  });
  
  message.channel.send(embed)
  
  
    ////////////////////
    /* KOD BAŞLANGICI */
    ////////////////////  
    let yedekDb = new db.table("yedek_" + message.guild.id)
  category.forEach(channel => {
    yedekDb.push("category",channel)
  })
  text.forEach(channel => {
    yedekDb.push("text",channel)
  })
  voice.forEach(channel => {
    yedekDb.push("voice",channel)
  })
  yedekDb.set("sıralama", kanallar)
  console.log(kanallar)
  message.reply("Yedeklendi.")
  

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