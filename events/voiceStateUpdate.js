const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("/app/ayarlar");
const moment = require("moment");
moment.locale("tr");

console.log("hi")

module.exports = async (oldVoiceState, newVoiceState) => {
  const guild = newVoiceState.guild;
  const client = newVoiceState.guild.client;
  const userID = newVoiceState.id;
  const user = client.users.cache.find(u => u.id == userID);
  const member = guild.member(user);

  if (userID == client.user.id) return;

  if (!oldVoiceState.channelID && newVoiceState.channelID) {
    // Sesli odaya katılmış.
    console.log(user.tag + " sesli odaya katıldı.")
    const voiceChannel = guild.channels.cache.find(c => c.id == newVoiceState.channelID)

    let rank = {
      id: user.id,
      expCurrent: 0,
      expMax: ayarlar.ranks.ses.expMaxs[0],
      level: 1
    }

    if (!db.get(`ranks_${guild.id}.ses.${user.id}`))
      db.set(`ranks_${guild.id}.ses.${user.id}`, rank)
    else
      rank = db.get(`ranks_${guild.id}.ses.${user.id}`);

    if (!client.sesTimers) client.sesTimers = {};
    client.sesTimers[user.id] = client.setInterval(() => {
      if (member.voice.selfMute || member.voice.serverMute) return;
      rank.expCurrent += 0.3;

      if (rank.expCurrent >= rank.expMax) {
        // LEVEL UP
        rank.level += 1;
        rank.expMax = ayarlar.ranks.ses.expMaxs[rank.level - 1]
      }

      db.set(`ranks_${guild.id}.ses.${user.id}`, rank)
    }, 1000);

    // expCurrent'e göre büyükten küçüğe sıralama
    //db.set(`ranks_${guild.id}.ses.toplist`, db.get(`ranks_${guild.id}.ses.toplist`).sort(function (a, b) { return b.expCurrent - a.expCurrent; }))



  } else if (oldVoiceState.channelID && !newVoiceState.channelID) {
    console.log(user.tag + " sesli odadan ayrıldı.")
    // sesli odadan ayrılmış.
    //const voiceChannel = guild.channels.cache.find(c => c.id == oldVoiceState.channelID)

    client.clearInterval(client.sesTimers[user.id]);
  }



};


