const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("/app/ayarlar");
const moment = require("moment");
moment.locale("tr")

module.exports = client => {

    const guild = client.guilds.cache.find(g => g.id == ayarlar.sunucu);
    if (!guild) return console.error("Ana sunucu bulunamadı! (ayarlar.sunucu). Doğum günü sistemi çalışmayacaktır.")

    let dgRol = guild.roles.cache.find(r => r.name == ayarlar.dgRolü)
    if (!dgRol) return console.error("Doğum günü rolü bulunamadı! (ayarlar.dgRolü). Doğum günü sistemi çalışmayacaktır.")

    let dgBilgiCh = guild.channels.cache.find(r => r.name == "dgko-bilgi")
    if (!dgBilgiCh) console.log("'dgko-bilgi' kanalı bulunamadığı için doğum günü bilgi mesajları gönderileyemecektir.")

    console.log(moment().utcOffset(3).format("D MMMM"))
    console.log(db.get(`dg.last_${guild.id}.day`))

    setInterval(async () => {
        if (parseInt(moment().utcOffset(3).format("HHmmss")) >= parseInt("000000") && db.get(`dg.last_${guild.id}.day`) != moment().utcOffset(3).format("DD")) { // Her gün saat 00:00'da dg kontrol
            //console.log("dgko kontrol ediliyor")
            let kaldırılanIDs = [];
            let dgIDs = [];

            await guild.members.cache.filter(m => m.roles.cache.has(dgRol.id)).forEach(async üye => {
                // önceki doğum günü rollerini kaldır
                kaldırılanIDs.push(üye.user.id)
                üye.roles.remove(dgRol)
                console.log(üye.user.id + " kaldırıldı.")
            })

            if (db.has("dg_" + guild.id + "." + moment().utcOffset(3).format("MMDD"))) {
                dgIDs = db.get("dg_" + guild.id + "." + moment().utcOffset(3).format("MMDD"))

                await dgIDs.forEach(async userID => {

                    let user = client.users.cache.find(u => u.id == userID);
                    let member = guild.member(user);

                    if (!member) return; // kullanıcı sunucudan kaçmış

                    await member.roles.add(dgRol);

                    if (member.displayName.match(/(\d+)/g) && !member.roles.cache.find(r => ayarlar.perms.vip.some(v => v == r.name))) // Vip değilse ve Adında sayı varsa 1 arttır
                        await member.setNickname(member.displayName.replace(/(\d+)/g, parseInt(member.displayName.match(/(\d+)/g).join("")) + 1))

                });
            }

            if (dgIDs.length == 0 && kaldırılanIDs.length == 0) return; // eklenen/silinen rol yok

            let dgEmbed = new Discord.MessageEmbed()
                .setTitle("Doğum Günü Sistemi")
                .setColor("RANDOM")
                .setFooter(moment().utcOffset(3).format("D MMMM"))
                .setTimestamp()

            if (dgIDs.length != 0) dgEmbed.addField("Rol Eklenenler", "<@" + dgIDs.join(">\n<@") + ">", true)
            if (kaldırılanIDs.length != 0) dgEmbed.addField("Rol Kaldırılanlar", "<@" + kaldırılanIDs.filter(n => !dgIDs.includes(n)).join(">\n<@") + ">", true)

            if (dgBilgiCh) dgBilgiCh.send(dgEmbed)

            await db.set(`dg.last_${guild.id}.day`, moment().utcOffset(3).format("DD"))

        }
    }, 1000)// her dakika kontrol


}