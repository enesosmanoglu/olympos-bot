const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("/app/ayarlar");
const backup = require("discord-backup");
const moment = require("moment");
moment.locale("tr");

module.exports = client => {
    const guild = client.guilds.cache.find(g => g.id == ayarlar.sunucu);
    if (!guild) return console.error("Ana sunucu bulunamadı! (ayarlar.sunucu). Rank kayıt sistemi çalışmayacaktır.")
    let sonKayıt;
    setInterval(() => {
        if (!client.rankKayıt) client.rankKayıt = {}

        Object.keys(client.rankKayıt).forEach(kayıt => {

            Object.keys(client.rankKayıt[kayıt]).forEach(userID => {

                Object.keys(client.rankKayıt[kayıt][userID]).forEach(async tür => {
                    let ay = moment().utcOffset(3).format('YYYYMM')
                    let dbPaths = {
                        toplam: `ranks_${guild.id}.${kayıt}.${userID}`,
                        aylık: `ranks_${guild.id}.aylık.${ay}.${kayıt}.${userID}`
                    }
                    let ranks = client.rankKayıt[kayıt][userID]
                    //console.log(userID," current: ",ranks) 
                    if (tür == "aylık") {
                        if (!ranks[tür][ay]) ranks[tür][ay] = {}
                        await db.set(dbPaths[tür], ranks[tür][ay])
                    } else
                        await db.set(dbPaths[tür], ranks[tür])
                    //await console.log("<@" + userID + ">", kayıt + "  /  " + tür + " db setted for " + "")

                    if (client.rankKayıt[kayıt][userID])
                        await delete client.rankKayıt[kayıt][userID]

                })

            })


        });


    }, 10000);

}