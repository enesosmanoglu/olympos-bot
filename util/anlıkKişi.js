const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("/app/ayarlar");
const backup = require("discord-backup");
const moment = require("moment");

module.exports = client => {
    const guild = client.guilds.cache.find(g => g.id == ayarlar.sunucu);
    if (!guild) return console.error("Ana sunucu bulunamadı! (ayarlar.sunucu). Anlık kişi sayısı sistemi çalışmayacaktır.")

    let genelCh = guild.channels.cache.find(c => c.name == "genel-chat")
    if (!genelCh) return console.log("'genel-chat' kanalı bulunamadığı için Anlık kişi sayısı çalışmayacaktır.")

    let sonKayıt;
    setInterval(() => {
        let toplamKişi = guild.members.cache.filter(m => !m.user.bot).size.toString();
        let aktifKişi = guild.members.cache.filter(o => !o.user.bot && ["online", "idle", "dnd"].some(a => a == o.presence.status)).size.toString();

        //console.log(aktifKişi)
        if (sonKayıt != aktifKişi) {
            // Set a new channel topic
            genelCh.setTopic(aktifKişi + "/" + toplamKişi)
                .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
                .catch(console.error);

            sonKayıt = aktifKişi;
        }
        
    }, 1000);

}