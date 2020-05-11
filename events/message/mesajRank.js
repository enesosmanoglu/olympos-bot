const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const moment = require("moment");
moment.locale("tr");
const fs = require("fs");


module.exports = async message => {
    const guild = message.guild;
    const client = message.client;
    const user = message.author;
    const userID = user.id;
    const member = message.member;
    if (user.bot) return; // Botları kayıt etmesin

    if (!guild) return; // DM mesajlarını kayıt etmesin.

    if (!member.roles.cache.some(r => ayarlar.perms.kayıtlı.some(k => k == r.name))) {
        return // kayıtlı değilse rank kasma 
    }

    let levelLogCh = guild.channels.cache.find(c => c.name == ayarlar.ranks.mesaj.logKanalları.level)

    let rankDefault = { // İlk giriş için varsayılan ayarlar.
        id: user.id,
        expCurrent: ayarlar.ranks.mesaj.varsayılan.expCurrent,
        expMax: ayarlar.ranks.mesaj.varsayılan.expMax,
        level: ayarlar.ranks.mesaj.varsayılan.level,
        lastTimestamp: 0
    }

    let ay = moment().utcOffset(3).format('YYYYMM')
    let ranks = {
        dbPaths: {
            toplam: `ranks_${guild.id}.mesaj.${user.id}`,
            aylık: `ranks_${guild.id}.aylık.${ay}.mesaj.${user.id}`
        }
    }
    let min = ayarlar.ranks.mesaj.harfBaşıExp;
    let max = ayarlar.ranks.mesaj.harfBaşıExpMax;
    let exp = getRandomArbitrary(min, max).toFixed(Math.max(min.toString().split(".")[1].length, max.toString().split(".")[1].length));

    Object.keys(ranks.dbPaths).forEach(tür => {
        getRankData(tür)
    });

    function getRankData(tür) {
        if (!db.get(ranks.dbPaths[tür])) {
            ranks[tür] = rankDefault;
            db.set(ranks.dbPaths[tür], ranks[tür]);
            sendLogs(client, levelLogCh, ranks, tür, userID)
        } else
            ranks[tür] = db.get(ranks.dbPaths[tür]);
    }

    Object.keys(ranks.dbPaths).forEach(tür => {
        giveExp(tür)
    });

    async function giveExp(tür) {
        // ranks[tür].lastTimestamp = 0;
        if (parseInt(moment().utcOffset(3).format('x')) < ranks[tür].lastTimestamp + (ayarlar.ranks.mesaj.cooldown * 1000)) return //message.reply("debug: exp gelmedi 12 sn cd var")

        let harfSayısı = message.content.length;

        if (harfSayısı > ayarlar.ranks.mesaj.maxHarfSayısı) harfSayısı = ayarlar.ranks.mesaj.maxHarfSayısı;


        ranks[tür].expCurrent += exp * harfSayısı;
        ranks[tür].expCurrent = parseFloat(ranks[tür].expCurrent)

        if (ranks[tür].expCurrent < calcExpMax(ranks[tür].level - 1 - 1)) { // -1 lerin bir tanesi herkesi 2 levelden başlattığımız için
            // LEVEL DOWN  ||  MaxExp sistemi değişirse otomatik level düşebilmesi için.
            console.log(user.tag + " level düştü! > " + tür)
            ranks[tür].level -= 1;
        } else if (ranks[tür].expCurrent >= ranks[tür].expMax) {
            // LEVEL UP
            console.log(user.tag + " level atladı! > " + tür)
            ranks[tür].level += 1;
            sendLogs(client, levelLogCh, ranks, tür, userID)
        }

        ranks[tür].expMax = calcExpMax(ranks[tür].level - 1);// -1 herkesi 2 levelden başlattığımız için

        ranks[tür].lastTimestamp = parseInt(moment().utcOffset(3).format('x'));

        //db.set(ranks.dbPaths[tür], ranks[tür])
        if (!client.rankKayıt) client.rankKayıt = {}
        if (!client.rankKayıt.mesaj) client.rankKayıt.mesaj = {}
        if (!client.rankKayıt.mesaj[user.id]) client.rankKayıt.mesaj[user.id] = {}
        if (tür == "aylık") {
            if (!client.rankKayıt.mesaj[user.id][tür]) client.rankKayıt.mesaj[user.id][tür] = {}
            client.rankKayıt.mesaj[user.id][tür][ay] = ranks[tür]
        }
        else
            client.rankKayıt.mesaj[user.id][tür] = ranks[tür]
    }




}

function calcExpMax(level) {
    let maxExp = 0;
    for (i = 1; i <= level; i++) {
        maxExp += ayarlar.ranks.mesaj.varsayılan.expMax * Math.pow(2, parseInt((i - 1) / 5))
    }
    return (maxExp)
}

String.prototype.format = function (args) {
    var str = this;
    return str.replace(String.prototype.format.regex, function (item) {
        var intVal = parseInt(item.substring(1, item.length - 1));
        var replace;
        if (intVal >= 0) {
            replace = args[intVal];
        } else if (intVal === -1) {
            replace = "{";
        } else if (intVal === -2) {
            replace = "}";
        } else {
            replace = "";
        }
        return replace;
    });
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function sendLogs(client, levelLogCh, ranks, tür, userID) {
    let emoji = client.emojis.cache.find(e => e.name == "oly_levelup")
    let mesaj = `${emoji} ` + ayarlar.ranks.mesaj.logMesajları.level[tür].format([userID, ranks[tür].level]);

    let embed = ranks[tür].level <= 2 ? mesaj : new Discord.MessageEmbed().setDescription(mesaj).setColor(ayarlar.renk)

    if (levelLogCh) {
        if (tür == "toplam") {
            if (db.get(`ranks_${levelLogCh.guild.id}.aylık`).filter(a => a) && Object.keys(db.get(`ranks_${levelLogCh.guild.id}.aylık`).filter(a => a)).length) {
                if (Object.keys(db.get(`ranks_${levelLogCh.guild.id}.aylık`).filter(a => a)).length > 1) {
                    levelLogCh.send(embed)
                }
            } else {
                levelLogCh.send(embed)
            }
        } else {
            levelLogCh.send(embed)
        }
    }
}  