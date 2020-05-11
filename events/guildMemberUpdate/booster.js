const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("/app/ayarlar");
const moment = require("moment");
moment.locale("tr");

module.exports = async (oldMember, newMember) => {
  const client = oldMember.client;
  const guild = newMember.guild;

  function getEmoji(emojiName, defaultEmoji) {
    let emoji = client.emojis.cache.find(e => e.name == emojiName);
    if (!emoji) emoji = ":" + defaultEmoji + ":"; // Üstteki emoji bulunamazsa varsayılan emoji (discord basic emojis)
    return emoji;
  }

  let emoji = getEmoji("konfeti", "small_orange_diamond");
  let emoji2 = getEmoji("aww", "wave");

  if (!oldMember.roles.cache.find(r => r.name == ayarlar.roles.booster) && newMember.roles.cache.find(r => r.name == ayarlar.roles.booster)) {
    // BOOSTER ROLÜ EKLENMİŞ
    db.set(`boosters_${newMember.guild.id}.${newMember.user.id}.timestamp`, parseInt(moment().utcOffset(3).format("x")))
    updateBoostersLog(guild)
  } else if (oldMember.roles.cache.find(r => r.name == ayarlar.roles.booster) && !newMember.roles.cache.find(r => r.name == ayarlar.roles.booster)) {
    // BOOSTER ROLÜ SİLİNMİŞ
    db.delete(`boosters_${newMember.guild.id}.${newMember.user.id}.timestamp`)
    updateBoostersLog(guild)
  };
}

async function updateBoostersLog(guild) {
  const client = guild.client;
  let boosterCh = guild.channels.cache.find(c => c.name == "nitro-boosters")
  if (boosterCh) {
    boosterCh.messages.fetch({ limit: 50 })
      .then(async messages => {
        let j = 0;
        messages.forEach(async message => {
          if (j++ == 0) return;
          if (message.author.id == client.user.id)
            await message.delete();
        });
        let lastMessage = messages.first();

        let boostersDesc = [];
        let i = 1;
        let topList = await Array.from(guild.roles.cache.find(r => r.name == ayarlar.roles.booster).members.keys()).sort((a, b) => db.get(`boosters_${guild.id}.${a}.timestamp`) - db.get(`boosters_${guild.id}.${b}.timestamp`))
        topList.forEach(boosterID => {
          boostersDesc.push(i++ + ". " + "<@" + boosterID + ">")
        });

        if (lastMessage.author.id != client.user.id) {
          boosterCh.send(new Discord.MessageEmbed()
            .setTitle("Olympos Destekçileri")
            .setDescription(boostersDesc.join("\n"))
          )
        } else {
          lastMessage.edit(new Discord.MessageEmbed()
            .setTitle("Olympos Destekçileri")
            .setDescription(boostersDesc.join("\n"))
          )
        }
      })
      .catch(console.error);
  }
}