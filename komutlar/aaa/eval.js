const Discord = require('discord.js');
const db = require('quick.db');
const komutAdı = __filename.replace(__dirname,"").replace("/","").replace(".js","")
const ayarlar = require("/app/ayarlar");

exports.run = async (client, message, args) => {

  let komut = message.content.replace(ayarlar.prefix,"").replace(komutAdı + " ","")
    
  message.reply(eval(komut))//.then(msg=>msg.delete({timeout:3000}))

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.üst
};

exports.help = {
    name: komutAdı,
    description: ``,
    usage: `${komutAdı}`
};