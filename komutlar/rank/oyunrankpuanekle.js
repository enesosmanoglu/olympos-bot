const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const moment = require("moment");
moment.locale("tr");
const fs = require("fs");

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {
    const guild = message.guild;

    let puanTürü = args[0];

    if (!Object.keys(ayarlar.ranks.oyun.exps).some(tür => tür == puanTürü))
        return;

    message.mentions.members.forEach(member => {
        const user = member.user;
        const userID = user.id;

        let levelLogCh = guild.channels.cache.find(c => c.name == ayarlar.ranks.oyun.logKanalları.level)

        let rankDefault = { // İlk giriş için varsayılan ayarlar.
            id: user.id,
            expCurrent: ayarlar.ranks.oyun.varsayılan.expCurrent,
            expMax: ayarlar.ranks.oyun.varsayılan.expMax,
            level: ayarlar.ranks.oyun.varsayılan.level,
            lastTimestamp: 0
        }

        let ranks = {
            dbPaths: {
                toplam: `ranks_${guild.id}.oyun.${user.id}`,
                aylık: `ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.oyun.${user.id}`
            }
        }
        let exp = ayarlar.ranks.oyun.exps[puanTürü]

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
            ranks[tür].expCurrent += exp;
            ranks[tür].expCurrent = parseFloat(ranks[tür].expCurrent)

            if (ranks[tür].expCurrent < calcExpMax(ranks[tür].level - 1 - 1)) { // -1 lerin bir tanesi herkesi 2 levelden başlattığımız için
                // LEVEL DOWN  ||  MaxExp sistemi değişirse otomatik level düşebilmesi için.
                console.log(user.tag + " level düştü! > " + tür)
                ranks[tür].level -= 1;
                if (ranks[tür].level < 1) ranks[tür].level = 1
            } else if (ranks[tür].expCurrent >= ranks[tür].expMax) {
                // LEVEL UP
                console.log(user.tag + " level atladı! > " + tür)
                ranks[tür].level += 1;
                sendLogs(client, levelLogCh, ranks, tür, userID)
            }

            ranks[tür].expMax = calcExpMax(ranks[tür].level - 1);// -1 herkesi 2 levelden başlattığımız için

            ranks[tür].lastTimestamp = parseInt(moment().utcOffset(3).format('x'));

            db.set(ranks.dbPaths[tür], ranks[tür])
        }
    });


}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.bot
};
exports.help = {
    name: komutAdı,
    description: ``,
    usage: `${komutAdı}`
};

function calcExpMax(level) {
    let maxExp = 0;
    for (i = 1; i <= level; i++) {
        maxExp += ayarlar.ranks.oyun.varsayılan.expMax * Math.pow(2, parseInt((i - 1) / 5))
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
    let mesaj = `${emoji} ` + ayarlar.ranks.oyun.logMesajları.level[tür].format([userID, ranks[tür].level]);

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