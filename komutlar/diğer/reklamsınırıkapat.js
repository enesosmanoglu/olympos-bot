const db = require('quick.db')
const Discord = require('discord.js')

exports.run = async (bot, message, args) => {

  let zatenkapalı = await db.fetch(`reklambanayar_${message.guild.id}`)
  if(zatenkapalı == 'kapali') {
    message.channel.send('Zaten aktif değil.')
  };
if(zatenkapalı == 'acik') {
        db.delete(`reklamsınır_${message.guild.id}`)
  db.set(`reklambanayar_${message.guild.id}`, 'kapali')
        message.channel.send(`Anti reklam sistemi kapatıldı.`);
};
  };


exports.conf = {
    perms: ["Zeus"],
    // => Yetkisiz komut: ["@everyone"]
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
    enabled: true,
    guildOnly: false,
    aliases: ['reklambankapat']
};

exports.help = {
    name: 'reklamsınırıkapat',
    description: 'Reklam ban sistemini kapatır.',
    usage: 'reklamsınırıkapat'
};