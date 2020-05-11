const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require("quick.db")

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {
    const guild = message.guild;

    let kayıtsızRol = guild.roles.cache.find(e => e.name == "Peasant of Olympos")
    if (!kayıtsızRol)
        return message.reply("Kayıtsız rolü bulunamadı")

    let taglıRol = guild.roles.cache.find(e => e.name == "Elite of Olympos");
    let tagsızRol = guild.roles.cache.find(e => e.name == "Rebel of Olympos");

    if (!taglıRol)
        return message.reply("Taglı rol bulunamadı")
    if (!tagsızRol)
        return message.reply("Tagsız rol bulunamadı")

    let vipler = [];
    let botlar = [];
    let kayıtsızlar = [];
    let tagOlanlar = [];
    let tagOlmayanlar = [];

    guild.members.cache.forEach(async member => {
        if (member.user.bot) return botlar.push(member.user.id)

        if (member.user.id == member.guild.ownerID) return tagOlanlar.push(member.user.id)

        if ((member.roles.cache.has(taglıRol.id) && !member.roles.cache.has(tagsızRol.id)) || (!member.roles.cache.has(taglıRol.id) && member.roles.cache.has(tagsızRol.id))) {
            // kayıtlılar
        } else {
            return kayıtsızlar.push(member.user.id); // Kayıtsız üye engeli
        }

        if (!member.displayName.match(/(\d+)/g) || member.roles.cache.find(r => ayarlar.perms.vip.some(v => v == r.name))) {
            return vipler.push(member.user.id) // adında sayı yoksa ya da vip rolü varsa
        }

        let isim = member.displayName.replace("[AFK]", "").replace("[MUTED]", "").replace(/[^a-zA-ZğĞüÜşŞıİöÖçÇ]+/g, '');
        let yaş = member.displayName.replace(/[^0-9]+/g, '');

        if (db.has(`users_${guild.id}.${member.user.id}`)) {
            let eski = db.get(`users_${guild.id}.${member.user.id}`);
            member.isim = eski.isim;
            member.yaş = eski.yaş;
            if (eski.cinsiyet)
                member.cinsiyet = eski.cinsiyet;
        } else {
            member.isim = isim;
            member.yaş = yaş;
        }

        console.log(member.isim, member.yaş, member.cinsiyet)

        await db.set(`users_${guild.id}.${member.user.id}`, member)
        await tagOlanlar.push(member.user.id)

    });


    let interval = setInterval(async () => {
        console.log(vipler.length + botlar.length + kayıtsızlar.length + tagOlanlar.length + tagOlmayanlar.length, guild.members.cache.size)
        if (vipler.length + botlar.length + kayıtsızlar.length + tagOlanlar.length + tagOlmayanlar.length >= guild.members.cache.size) {
            clearInterval(interval)

            let embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTimestamp()
                .setDescription(`
                **${kayıtsızlar.length}** kişi henüz kayıt olmamış.
                **${Object.keys(db.get(`users_${guild.id}`)).length}** kişinin kaydı yapıldı.
                `)

            await message.channel.send(embed)
        }
    }, 100);


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