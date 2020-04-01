const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

const komutAdı = __filename.replace(__dirname,"").replace("/","").replace(".js","")

exports.run = async (client, message, args) => {

    let say = 0;

    await message.guild.channels.cache.filter(c=>c.type=="voice").forEach(ch => {
        console.log(ch.members.size)
        say += ch.members.size;
    });

    await message.channel.send(new Discord.MessageEmbed()
        .setDescription(`Sesli kanallardaki toplam kullanıcı sayısı: **${say}**`)
        .setColor("RANDOM")
    )//.then(msg => msg.delete({ timeout: 10000 }));

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['sesüye'],
    perms: ayarlar.perms.yetkili
};
exports.help = {
    name: komutAdı,
    description: `Sesli kanallara giriş yapmış toplam kullanıcı sayısını gösterir.`,
    usage: `${komutAdı}`
};