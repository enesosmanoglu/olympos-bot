const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("/app/ayarlar");
const backup = require("discord-backup");
const moment = require("moment");
moment.locale("tr")
const { GoogleSpreadsheet } = require('google-spreadsheet');
const shortNumber = require('short-number');

module.exports = client => {

    const guild = client.guilds.cache.find(g => g.id == ayarlar.sunucu);
    if (!guild) return console.error("Ana sunucu bulunamadı! (ayarlar.sunucu). Tablo kayıt sistemi çalışmayacaktır.")

    //tabloKayıt() // Bot açıldığında 1 kere kayıt yapsın

    client.setInterval(async () => {
        tabloKayıt()
    }, 120000);

    function tabloKayıt() {
        Object.keys(ayarlar.ranks).forEach(kategori => {
            kayıt(kategori)
        });

        async function kayıt(kategori) {
            if (!db.has(`ranks_${guild.id}.${kategori}`)) return;
            console.log(kategori + " kaydı yapılıyor.")
            const doc = new GoogleSpreadsheet(ayarlar.ranks[kategori].googleTablo);
            await doc.useServiceAccountAuth(ayarlar.client_secret);
            const info = await doc.loadInfo();
            //const sheet = await doc.sheetsByIndex[0];
            //await sheet.clear();
            const headers = ayarlar.ranks[kategori].headers;
            //await sheet.setHeaderRow(headers);
            if (Object.keys(doc._rawSheets).length == 1) {
                await doc.addSheet({ title: moment().utcOffset(3).format("x"), headerValues: ["Bu sekme hatanın önüne geçmek için otomatik olarak oluşturulmuştur."] });
            }
            if (doc.sheetsByIndex[0].title == moment().utcOffset(3).format("DDMM"))
                await doc.sheetsByIndex[0].del();
            const sheet = await doc.addSheet({ index: 0, title: moment().utcOffset(3).format("DDMM"), headerValues: headers });

            //let topList = await Object.values(db.get(`ranks_${guild.id}.${kategori}`)).sort((a, b) => b.expCurrent - a.expCurrent)
            let topList = await Object.values(db.get(`ranks_${guild.id}.${kategori}`)).filter(rankObj => !ayarlar.perms.sıralamaDışı.some(yetkiliRolName => guild.members.cache.find(m => m.id == rankObj.id) && guild.members.cache.find(m => m.id == rankObj.id).roles.cache.some(role => role.name == yetkiliRolName))).sort((a, b) => b.expCurrent - a.expCurrent)

            let rows = []

            let t = 0;
            await topList.forEach(async rank => {
                let user = client.users.cache.find(u => u.id == rank.id);
                if (!user) return //console.error(rank.id + " id'ye sahip üyeyi bulamadım.") // sunucudan ayrılmış

                t += 1;
                let rec = {}
                rec[headers[0]] = (t > 3) ? (t) : "";
                rec[headers[1]] = user.tag
                rec[headers[2]] = shortNumber(parseInt(rank.expCurrent))
                rec[headers[3]] = rank.level
                await rows.push(rec);
            });
            const moreRows = await sheet.addRows(rows, { insert: true });
        }
    }

}