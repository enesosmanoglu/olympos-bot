const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("/app/ayarlar");
const backup = require("discord-backup");
const moment = require("moment");
moment.locale("tr")
const fs = require("fs")

module.exports = client => {

    const guild = client.guilds.cache.find(g => g.id == ayarlar.sunucu);
    if (!guild) return console.error("Ana sunucu bulunamadı! (ayarlar.sunucu). Otomatik mesaj sistemi çalışmayacaktır.")


    setInterval(() => {
        //guild.channels.cache.filter(ch => ch.type == "text" && ch.permissionsFor(guild.roles.everyone).any('SEND_MESSAGES')).forEach(channel => {
        // Get messages
        let channel = guild.channels.cache.find(ch => ch.name == "genel-chat")

        if (!channel) console.error("otoMesaj kanalı bulunamadı (genel-chat). Otomatik mesaj sistemi çalışmadı.")

        if (channel) {
            channel.messages.fetch({ limit: 5 })
                .then(async messages => {
                    //console.log(`Received ${messages.size} messages`)
                    if (messages.size != 5) return; // 5 mesajdan az olan kanallara dokunma

                    if (!messages.find(m => m.author.id == client.user.id)) {
                        const mesajlar = fs.readFileSync('/app/otoMesaj.txt', 'UTF-8').split("☻")
                        let lastID = db.has(`otoMesaj_${guild.id}.lastMessageID`) ? db.get(`otoMesaj_${guild.id}.lastMessageID`) : 0;
                        let nextID = (lastID + 1) % mesajlar.length
                        await channel.send(client.replaceEmojis(mesajlar[lastID]))
                            .then(msg => {
                                db.set(`otoMesaj_${guild.id}.lastMessageID`, nextID)
                            })
                    }
                })
                .catch(console.error);
        }         //});
    }, 1000 * (60 * 60 * 3 - (Math.random() * 200 + 50))); // 3 saat




}