const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

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

    let botlar = [];
    let kayıtsızlar = [];
    let tagOlanlar = [];
    let tagOlmayanlar = [];
    let vipler = [];

    let tagEklenenler = [];
    let tagÇıkarılanlar = [];

    guild.members.cache.forEach(async member => {
        if (member.user.bot) return botlar.push(member.user.id)

        if ((member.roles.cache.has(taglıRol.id) && !member.roles.cache.has(tagsızRol.id)) || (!member.roles.cache.has(taglıRol.id) && member.roles.cache.has(tagsızRol.id))) {
            // kayıtlılar
        } else {
            return kayıtsızlar.push(member.user.id); // Kayıtsız üye engeli
        }

        let tag = "✧";
        let tag2 = "✦";

        if (!member.displayName.match(/(\d+)/g) || member.roles.cache.find(r => ayarlar.perms.vip.some(v => v == r.name))) {
            if (!member.displayName.startsWith("[AFK]")) {
                await member.setNickname(member.displayName.replace(tag, '').replace(tag2, '').trim() + " " + tag);
            } else {
                await member.setNickname("[AFK] " + member.displayName.replace(tag, '').replace(tag2, '').replace("[AFK]", '').trim() + " " + tag);
            }
            return vipler.push(member.user.id) // adında sayı yoksa ya da vip rolü varsa
        }

        let isim = member.displayName.replace("[AFK]", "").replace("[MUTED]", "").replace(/[^a-zA-ZğĞüÜşŞıİöÖçÇ]+/g, '');
        let yaş = member.displayName.replace(/[^0-9]+/g, '');

        if (member.user.username.includes(tag)) {
            // Tag var
            let taglıRolVarMı = member.roles.cache.has(taglıRol.id);

            if (!taglıRolVarMı) {
                await member.roles.add(taglıRol);
                await member.roles.remove(tagsızRol);
                await tagEklenenler.push(member.user.id)
            }

            if (!member.displayName.includes(tag)) {
                if (!member.displayName.startsWith("[AFK]")) {
                    await member.setNickname(`${isim} ${tag} ${yaş}`);
                } else {
                    await member.setNickname(`[AFK] ${isim} ${tag} ${yaş}`);
                }
            }

            return tagOlanlar.push(member.user.id);
        } else {
            // Tag yok
            let taglıRolVarMı = member.roles.cache.has(taglıRol.id);

            if (taglıRolVarMı) {
                await member.roles.add(tagsızRol);
                await member.roles.remove(taglıRol);
                await tagÇıkarılanlar.push(member.user.id)
            }

            if (member.displayName.includes(tag)) {
                if (!member.displayName.startsWith("[AFK]")) {
                    await member.setNickname(`${isim} ${tag} ${yaş}`);
                } else {
                    await member.setNickname(`[AFK] ${isim} ${tag} ${yaş}`);
                }
            }

            return tagOlmayanlar.push(member.user.id);
        }

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
                **${tagOlanlar.length}** kişinin tagı var.
                **${tagOlmayanlar.length}** kişinin tagı yok.
                `)

            if (tagEklenenler.length != 0) {
                embed.addField("TAG EKLENENLER - " + tagEklenenler.length, "<@" + tagEklenenler.join(">\n<@") + ">")
            }
            if (tagÇıkarılanlar.length != 0) {
                embed.addField("TAG ÇIKARILANLAR - " + tagÇıkarılanlar.length, "<@" + tagÇıkarılanlar.join(">\n<@") + ">")
            }

            await message.channel.send(embed)
        }
    }, 100);


};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['tagk', 'tag-kontrol'],
    perms: ayarlar.perms.üst
};

exports.help = {
    name: komutAdı,
    description: 'Herkesin tag-rol eşleşmesini kontrol eder.',
    usage: komutAdı
};