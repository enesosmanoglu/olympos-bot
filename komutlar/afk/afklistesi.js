const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require("quick.db")
const moment = require("moment")
moment.locale("tr")

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {
    const guild = message.guild;

    let desc = []

    let users = db.get(`afk_${guild.id}`);

    Object.keys(users).forEach(userID => {
        let afk = users[userID];
        console.log(afk.timestamp)
        desc.push(`<@${userID}>: ${afk.sebep} | ${moment(afk.timestamp, 'x').utcOffset(3).format('lll')}`)
    });

    let embeds = [new Discord.MessageEmbed().setColor(ayarlar.renk)]
    let charCount = 0;

    desc.forEach(kayıt => {
        charCount += kayıt.length
        if ((charCount + kayıt.length) > 2000) {
            charCount = kayıt.length
            embeds.push(new Discord.MessageEmbed().setDescription(kayıt).setColor(ayarlar.renk))
        } else {
            if (embeds[embeds.length - 1].description)
                embeds[embeds.length - 1].description += "\n" + kayıt
            else
                embeds[embeds.length - 1].description = kayıt
        }

    });


    embeds.forEach(async embed => {
        if (!embed.description)
            embed.description = "**BULUNAMADI!**"
        await console.log(embed.description.length)
        await message.channel.send(embed)
    });



};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.üst
};

exports.help = {
    name: komutAdı,
    description: 'Herkesin tag-rol eşleşmesini kontrol eder.',
    usage: komutAdı
};