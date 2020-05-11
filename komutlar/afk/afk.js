const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const moment = require("moment")
moment.locale("tr")

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {

    message.delete();

    let logChannel = message.guild.channels.cache.find(c => c.name == "afk-logs")

    if (args.length == 0) {// TEMİZ KOD: YA AFK'DAN ÇIKMAK İSTİYOR YA DA SEBEP BELİRTMEYİ UNUTTU !

        if (db.has(`afk_${message.guild.id}.${message.author.id}`)) {
            // ÖNCEDEN AFK
            await db.delete(`afk_${message.guild.id}.${message.author.id}`)
            await message.member.setNickname(message.member.displayName.replace("[AFK]", ""))
            await message.channel.send(new Discord.MessageEmbed().setDescription(`<@${message.author.id}>, artık afk değil.`).setColor("GREEN"))
            if (logChannel)
                await logChannel.send(new Discord.MessageEmbed().setDescription(`<@${message.author.id}>, artık afk değil.`).setColor("GREEN"))
        } else {
            // yeni afk olucak ama sebep yok 
            message.channel.send(new Discord.MessageEmbed().setDescription(`<@${message.author.id}>, lütfen afk olmak istediğiniz sebebi belirtiniz.`))
        }

    } else { // EK YAZI İÇEREN KOD: BİRİLERİ AFK OLMAK İSTİYOR YA DA ÇIKMAK İSTERKEN YANLIŞIKLA SEBEP BELİRTTİ (ne işe yarıyacaksa xd)
        if (db.has(`afk_${message.guild.id}.${message.author.id}`)) {
            // ÖNCEDEN AFK
            await db.delete(`afk_${message.guild.id}.${message.author.id}`)
            await message.member.setNickname(message.member.displayName.replace("[AFK]", ""))
            await message.channel.send(new Discord.MessageEmbed().setDescription(`<@${message.author.id}>, artık afk değil.`).setColor("GREEN"))
            if (logChannel)
                await logChannel.send(new Discord.MessageEmbed().setDescription(`<@${message.author.id}>, artık afk değil.`).setColor("GREEN"))
        } else {
            // yeni afk oluyor
            let sebep = args.join(" ");

            await console.log(db.set(`afk_${message.guild.id}.${message.author.id}`, { id: message.author.id, sebep: sebep, timestamp: moment().utcOffset(3).format('x') }))
            await message.member.setNickname("[AFK] " + message.member.displayName.replace("[AFK]", ""))
            await message.channel.send(new Discord.MessageEmbed().setDescription(`<@${message.author.id}>, ${sebep} sebebiyle afk oldu.`).setColor("RED"))
            if (logChannel)
                await logChannel.send(new Discord.MessageEmbed().setDescription(`<@${message.author.id}>, ${sebep} sebebiyle afk oldu.`).setColor("RED"))
        }

    }

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.kayıtlı
};
exports.help = {
    name: komutAdı,
    description: `Sebep belirterek afk ol ya da afk olmaktan çık.`,
    usage: `${komutAdı} sebep`
};