const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");

module.exports = async (oldUser = new Discord.User(), newUser = new Discord.User()) => {
    if (oldUser.username == newUser.username) return; // user.username değişikliği yoksa dön

    if (oldUser.bot) return;

    let client = oldUser.client;

    let guild = client.guilds.cache.find(e => e.id == client.ayarlar.sunucu);
    if (!guild) return; // Sunucu yoksa dön

    let oldMember = guild.members.cache.find(e => e.id == oldUser.id);
    let newMember = guild.members.cache.find(e => e.id == newUser.id);

    if (!oldMember || !newMember) return;

    let kayıtsızRol = guild.roles.cache.find(e => e.name == "Peasant of Olympos")
    if (!kayıtsızRol)
        return console.error("Kayıtsız rolü bulunamadı")

    if (oldMember.roles.cache.length == 0 || oldMember.roles.cache.has(kayıtsızRol.id))
        return; // Kayıtsız üye engeli
    if (newMember.roles.cache.length == 0 || newMember.roles.cache.has(kayıtsızRol.id))
        return; // Kayıtsız üye engeli

    console.log("Kayıtlı üye nick değiştirdi.");

    let tag = "✧";
    let tag2 = "✦";

    let taglıRol = guild.roles.cache.find(e => e.name == "Elite of Olympos");
    let tagsızRol = guild.roles.cache.find(e => e.name == "Rebel of Olympos");

    if (!taglıRol)
        return console.log("Taglı rol bulunamadı")
    if (!tagsızRol)
        return console.log("Tagsız rol bulunamadı")

    let oldName = oldUser.username;
    let newName = newUser.username;

    console.log(oldName, " >> ", newName);
    let embedTitle;

    let isim = oldMember.displayName.replace("[AFK]", "").replace("[MUTED]", "").replace(/[^a-zA-ZğĞüÜşŞıİöÖçÇ]+/g, '');
    let yaş = oldMember.displayName.replace(/[^0-9]+/g, '');

    if (!oldName.includes(tag) && newName.includes(tag)) {
        // Tag eklemiş
        embedTitle = " tag ekledi.";
        console.log(oldMember.displayName + " tag ekledi.");
        await newMember.roles.add(taglıRol);
        await newMember.roles.remove(tagsızRol);
        await console.log("Taglı rol eklendi!");

        if (!oldMember.displayName.match(/(\d+)/g) || oldMember.roles.cache.find(r => ayarlar.perms.vip.some(v => v == r.name))) {
            // adında sayı yoksa ya da vip rolü varsa
            let nick = oldMember.displayName.replace("[AFK]", "").replace("[MUTED]", "").replace(tag, "").replace(tag2, "")
            if (!newMember.displayName.includes("[AFK]")) {
                await newMember.setNickname(`${nick} ${tag} ${newMember.displayName.endsWith("[MUTED]") ? "[MUTED]" : ""}`);
            } else {
                await newMember.setNickname(`[AFK] ${nick} ${tag} ${newMember.displayName.endsWith("[MUTED]") ? "[MUTED]" : ""}`);
            }
        } else {
            if (!newMember.displayName.includes("[AFK]")) {
                await newMember.setNickname(`${isim} ${tag} ${yaş} ${newMember.displayName.endsWith("[MUTED]") ? "[MUTED]" : ""}`);
            } else {
                await newMember.setNickname(`[AFK] ${isim} ${tag} ${yaş} ${newMember.displayName.endsWith("[MUTED]") ? "[MUTED]" : ""}`);
            }
        }


    }
    if (oldName.includes(tag) && !newName.includes(tag)) {
        // Tag silmiş
        embedTitle = " tag sildi.";
        console.log(oldMember.displayName + " tag sildi.");
        await newMember.roles.add(tagsızRol);
        await newMember.roles.remove(taglıRol);
        await console.log("Tagsız rol eklendi!");

        if (!oldMember.displayName.match(/(\d+)/g) || oldMember.roles.cache.find(r => ayarlar.perms.vip.some(v => v == r.name))) {
            // adında sayı yoksa ya da vip rolü varsa
            let nick = oldMember.displayName.replace("[AFK]", "").replace("[MUTED]", "").replace(tag, "").replace(tag2, "")
            if (!newMember.displayName.includes("[AFK]")) {
                await newMember.setNickname(`${nick} ${tag2} ${newMember.displayName.endsWith("[MUTED]") ? "[MUTED]" : ""}`);
            } else {
                await newMember.setNickname(`[AFK] ${nick} ${tag2} ${newMember.displayName.endsWith("[MUTED]") ? "[MUTED]" : ""}`);
            }
        } else {
            if (!newMember.displayName.includes("[AFK]")) {
                await newMember.setNickname(`${isim} ${tag2} ${yaş} ${newMember.displayName.endsWith("[MUTED]") ? "[MUTED]" : ""}`);
            } else {
                await newMember.setNickname(`[AFK] ${isim} ${tag2} ${yaş} ${newMember.displayName.endsWith("[MUTED]") ? "[MUTED]" : ""}`);
            }
        }
        await console.log("yeni nick: ", newMember.displayName);
    }

    if (!embedTitle) return;

    let bilgiEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setAuthor(newUser.tag, newUser.displayAvatarURL({ dynamic: true }))
        .setDescription(`<@${newUser.id}> ` + embedTitle)

    if (embedTitle.includes("sildi"))
        bilgiEmbed.setColor("RED")
    else if (embedTitle.includes("ekledi"))
        bilgiEmbed.setColor("GREEN")
    else
        bilgiEmbed.setColor(ayarlar.renk)

    let tagBilgi = guild.channels.cache.find(e => e.name == "tag-bilgi");
    if (tagBilgi)
        await tagBilgi.send(bilgiEmbed);
};
