const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {

    ////////////////////
    /* KOD BAŞLANGICI */
    ////////////////////  

    if (args.length != 1 || !["aç","kapat"].some(a=>a == args[0].toLowerCase()))
        return message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Hatalı kullanım ●︿●`)
            .addField(`Nasıl kullanılır?`,`${ayarlar.prefix}${komutAdı} **aç**\n${ayarlar.prefix}${komutAdı} **kapat**`)
            .setColor("RANDOM")
        ).then(msg => msg.delete({ timeout: 10000 }));

    let durum = args[0].toLowerCase() == "aç" ? true : false
 
    await message.channel.updateOverwrite(message.guild.roles.everyone.id,
        {
            SEND_MESSAGES: durum
        }
    );

    await message.channel.send(new Discord.MessageEmbed()
        .setDescription(`Kanal mesaj yazımına **${durum?"açıldı":"kapatıldı"}!**`)
        .setColor("RANDOM")
    )

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['kanalmute'],
    perms: ayarlar.perms.yetkili // => Yetkisiz komut: @everyone
};
exports.help = {
    name: komutAdı,
    description: `Yazıldığı kanalı mesaj yazmaya açar/kapatır.`,
    usage: `${komutAdı} aç/kapat`
};