const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {

    let üye = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
    if (!üye)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`Doğum günü kaydı silinecek kişiyi etiketlemelisin ●︿●`)
            .addField(`Nasıl kullanılır?`, `${ayarlar.prefix}${komutAdı} **@kullanıcı**`)
            .setColor("RANDOM")
        ).then(msg => msg.delete({ timeout: 10000 }));

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key].some(v => v == value));
    }

    let dg = getKeyByValue(db.get("dg_" + message.guild.id), üye.user.id);
    console.log(dg)
    if (!dg) {
        return message.channel.send(new Discord.MessageEmbed()
            .setTitle("HATA")
            .setDescription(`${üye} kullanıcısının doğum günü kaydı bulunamadı.`)
            .setColor("RED")
        )
    }

    let newArr = db.get("dg_" + message.guild.id + "." + dg)
    const index = newArr.indexOf(üye.user.id);
    if (index > -1) {
        await newArr.splice(index, 1);
        await console.log(db.set("dg_" + message.guild.id + "." + dg, newArr))
        return await message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${üye} kullanıcısının doğum günü kaydı silindi.`)
            .setColor("GREEN")
        )
    }

    console.log("WTF")

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['dgsıfırla'],
    perms: ayarlar.perms.yetkili
};
exports.help = {
    name: komutAdı,
    description: `Seçilen kullanıcının doğum günü kaydını siler.`,
    usage: `${komutAdı} @kullanıcı`
};