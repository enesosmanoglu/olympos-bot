const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("/app/ayarlar");
const backup = require("discord-backup");
const moment = require("moment");

module.exports = client => {

    const guild = client.guilds.cache.find(g => g.id == ayarlar.sunucu);
    if (!guild) return console.error("Ana sunucu bulunamadı! (ayarlar.sunucu). Otomatik mesaj sistemi çalışmayacaktır.")


    setInterval(() => {
        guild.channels.cache.filter(ch => ch.type == "text" && ch.permissionsFor(guild.roles.everyone).any('SEND_MESSAGES')).forEach(channel => {
            // Get messages
            channel.messages.fetch({ limit: 5 })
                .then(messages => {
                    //console.log(`Received ${messages.size} messages`)
                    if (messages.size != 5) return; // 5 mesajdan az olan kanallara dokunma
    
                    if (!messages.find(m=>m.author.id == client.user.id)) {
                        channel.send("mesaj atın laan")
                    }
                })
                .catch(console.error);
        });
    }, 10000);




}