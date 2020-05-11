const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("/app/ayarlar");
const moment = require("moment");
moment.locale("tr");

module.exports = async (oldVoiceState, newVoiceState) => {
  const guild = newVoiceState.guild;
  const client = newVoiceState.guild.client;
  const userID = newVoiceState.id;
  const user = client.users.cache.find(u => u.id == userID);
  const member = guild.member(user);

  if (user.bot) return; // Botları kayıt etmesin 

  if (!member.roles.cache.some(r => ayarlar.perms.kayıtlı.some(k => k == r.name))) {
    return // kayıtlı değilse rank kasma
  }

  let levelLogCh = guild.channels.cache.find(c => c.name == ayarlar.ranks.ses.logKanalları.level)


  if (!oldVoiceState.channelID && newVoiceState.channelID) {
    // Sesli odaya katılmış.
    //console.log(user.tag + " sesli odaya katıldı.")
    const voiceChannel = guild.channels.cache.find(c => c.id == newVoiceState.channelID)

    let rankDefault = { // İlk giriş için varsayılan ayarlar.
      id: user.id,
      expCurrent: ayarlar.ranks.ses.varsayılan.expCurrent,
      expMax: ayarlar.ranks.ses.varsayılan.expMax,
      level: ayarlar.ranks.ses.varsayılan.level
    }

    let ay = moment().utcOffset(3).format('YYYYMM');

    let ranks = {
      dbPaths: {
        toplam: `ranks_${guild.id}.ses.${user.id}`,
        aylık: `ranks_${guild.id}.aylık.${ay}.ses.${user.id}`
      }
    }

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


    if (!client.sesTimers) client.sesTimers = {};
    if (!client.sesSaverTimers) client.sesSaverTimers = {};
    client.sesTimers[user.id] = client.setInterval(() => {
      let min = ayarlar.ranks.ses.saniyeBaşıExp;
      let max = ayarlar.ranks.ses.saniyeBaşıExpMax;
      let exp = parseFloat(getRandomArbitrary(min, max).toFixed(Math.max(min.toString().split(".")[1].length, max.toString().split(".")[1].length)));

      Object.keys(ranks.dbPaths).forEach(tür => {
        giveExp(tür)
      });

      async function giveExp(tür) {
        if (voiceChannel.members.size < ayarlar.ranks.ses.minKişiSayısı) return; // Minimum kişi sayısı yoksa kayıt almasın!
        if (member.voice.selfMute || member.voice.serverMute) return; // Mic kapalıyken kayıt almasın!


        ranks[tür].expCurrent += exp;
        ranks[tür].expCurrent = parseFloat(ranks[tür].expCurrent)
        if (tür == "aylık" && user.username == "✧✧") {
          console.log(user.tag + " got " + exp, "current:", ranks[tür].expCurrent)
        }
        //console.log(user.tag + " got " + exp)
        //console.log(ranks[tür].expCurrent + "\n")
        //console.log(ranks[tür].level, ranks[tür].expMax, ranks[tür].expCurrent)

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

        if (!client.rankKayıt) client.rankKayıt = {}
        if (!client.rankKayıt.ses) client.rankKayıt.ses = {}
        if (!client.rankKayıt.ses[user.id]) client.rankKayıt.ses[user.id] = {}
        if (tür == "aylık") {
          if (!client.rankKayıt.ses[user.id][tür]) client.rankKayıt.ses[user.id][tür] = {}
          client.rankKayıt.ses[user.id][tür][ay] = ranks[tür]
        }
        else
          client.rankKayıt.ses[user.id][tür] = ranks[tür]
      }

    }, 1000);

    client.sesSaverTimers[user.id] = client.setInterval(() => {
      return;
      Object.keys(ranks.dbPaths).forEach(tür => {
        db.set(ranks.dbPaths[tür], ranks[tür]);
      });
      //console.log(user.id, " got exp current: " + ranks["aylık"].expCurrent)
    }, 15000)

    // expCurrent'e göre büyükten küçüğe sıralama
    //db.set(`ranks_${guild.id}.ses.toplist`, db.get(`ranks_${guild.id}.ses.toplist`).sort(function (a, b) { return b.expCurrent - a.expCurrent; }))

  } else if (oldVoiceState.channelID && !newVoiceState.channelID) {
    //console.log(user.tag + " sesli odadan ayrıldı.")
    // sesli odadan ayrılmış.
    //const voiceChannel = guild.channels.cache.find(c => c.id == oldVoiceState.channelID)

    if (client.rankKayıt && client.rankKayıt.ses && client.rankKayıt.ses[user.id])
      delete client.rankKayıt.ses[user.id]

    client.clearInterval(client.sesTimers[user.id]);
    client.clearInterval(client.sesSaverTimers[user.id]);
  }



};

function calcExpMax(level) {
  let maxExp = 0;
  for (i = 1; i <= level; i++) {
    maxExp += ayarlar.ranks.ses.varsayılan.expMax * Math.pow(2, parseInt((i - 1) / 5))
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


function sendLogs(client, levelLogCh, ranks, tür, userID) {
  let emoji = client.emojis.cache.find(e => e.name == "oly_levelup")
  let mesaj = `${emoji} ` + ayarlar.ranks.ses.logMesajları.level[tür].format([userID, ranks[tür].level]);

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