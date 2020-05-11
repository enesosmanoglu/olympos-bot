const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");

exports.run = (client, message, args) => {
	let mesaj = args.slice(0).join(' ');
	if (mesaj.length < 1) return message.channel.send(new Discord.MessageEmbed().setDescription(`${ayarlar.prefix}yaz <mesaj>`).setColor(10038562).setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));
  message.delete();
  message.channel.send(mesaj);
};

exports.conf = {
    perms: ayarlar.perms.üst,
    // => Yetkisiz komut: @everyone
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
  enabled: true,
  guildOnly: false,
  aliases: ['yazdır'],
};

exports.help = {
  name: 'yaz',
  description: '',
  usage: 'yaz <mesaj>'
};
