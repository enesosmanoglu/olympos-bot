const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

const komutAdı = __filename.replace(__dirname,"").replace("/","").replace(".js","")

exports.run = async (client, message, args) => {

    if (args.length == 0) {// TEMİZ KOD: YA AFK'DAN ÇIKMAK İSTİYOR YA DA SEBEP BELİRTMEYİ UNUTTU !

        if (db.has(`afk_${message.guild.id}.${message.author.id}`)) {
            // ÖNCEDEN AFK
            await db.delete(`afk_${message.guild.id}.${message.author.id}`)
            await message.member.setNickname(message.member.displayName.replace("[AFK]",""))
            await message.channel.send(new Discord.MessageEmbed().setDescription(`${message.author}, artık afk değilsiniz.`).setColor("GREEN"))
        } else {
            // yeni afk olucak ama sebep yok 
            message.channel.send(new Discord.MessageEmbed().setDescription(`${message.author}, lütfen afk olmak istediğiniz sebebi belirtiniz.`))
        }
        
    } else { // EK YAZI İÇEREN KOD: BİRİLERİ AFK OLMAK İSTİYOR YA DA ÇIKMAK İSTERKEN YANLIŞIKLA SEBEP BELİRTTİ (ne işe yarıyacaksa xd)
        if (db.has(`afk_${message.guild.id}.${message.author.id}`)) {
            // ÖNCEDEN AFK
            await db.delete(`afk_${message.guild.id}.${message.author.id}`)
            await message.member.setNickname(message.member.displayName.replace("[AFK]",""))
            await message.channel.send(new Discord.MessageEmbed().setDescription(`${message.author}, artık afk değilsiniz.`).setColor("GREEN"))
        } else {
            // yeni afk oluyor
            let sebep = args.join(" ");
      
            await console.log(db.set(`afk_${message.guild.id}.${message.author.id}`,sebep))
            await message.member.setNickname("[AFK] " + message.member.displayName.replace("[AFK]",""))
            await message.channel.send(new Discord.MessageEmbed().setDescription(`${message.author}, ${sebep} sebebiyle afk oldunuz.`).setColor("RED"))
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