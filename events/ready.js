const moment = require('moment');
moment.locale("tr");
const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const shortNumber = require('short-number');

module.exports = async client => {
  require("/app/util/banKontrol")(client);
  require("/app/util/süreKontrol")(client);
  require("/app/util/dgko")(client);
  require("/app/util/otoMesaj")(client);
  require("/app/util/otoMesajTroll")(client);
  require("/app/util/anlıkKişi")(client);
  require("/app/util/tabloKayıt")(client);
  require("/app/util/rankKayıt")(client);
  console.log(`Aktif, ${client.commands.size} komut yüklendi!`);
  console.log(`${client.user.tag} giriş yaptı.`);

  // seste olanları sesrank kaydına al
  client.guilds.cache.forEach(guild => {
    guild.channels.cache.filter(c => c.type == "voice").forEach(channel => {
      channel.members.forEach(member => {
        const voice = {
          guild: member.voice.guild,
          id: member.voice.id,
          serverDeaf: member.voice.serverDeaf,
          serverMute: member.voice.serverMute,
          selfDeaf: member.voice.selfDeaf,
          selfMute: member.voice.selfMute,
          sessionID: member.voice.sessionID,
          streaming: member.voice.streaming,
          channelID: null
        }
        //console.log(member.voice.channelID)
        client.emit("voiceStateUpdate", voice, member.voice);
      });
    });
  });

  client.updateTop10Log = async function (guild) {
    const client = guild.client;
    let top10Ch = guild.channels.cache.find(c => c.name == "ayın-en-iyileri")
    if (top10Ch) {
      top10Ch.messages.fetch({ limit: 50 })
        .then(async messages => {
          let j = 0;



          let lastMessage;

          lastMessage = messages.find(m => m.author.id == client.user.id);

          // messages.forEach(async message => {
          //   if (j++ == 0) return;
          //   if (message.author.id == client.user.id)
          //     message.delete()
          // });
          // lastMessage = messages.first();

          let kategoriDescs = {}
          await Object.keys(ayarlar.ranks).forEach(async kategori => {
            let topListDesc = [];
            let i = 1;
            if (!db.has(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.${kategori}`)) return //console.error(kategori + " kategorisinde henüz kayıt yok!")
            let topList = await Object.values(db.get(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.${kategori}`)).filter(rankObj => !ayarlar.perms.sıralamaDışı.some(yetkiliRolName => guild.members.cache.find(m => m.id == rankObj.id) && guild.members.cache.find(m => m.id == rankObj.id).roles.cache.some(role => role.name == yetkiliRolName))).sort((a, b) => b.expCurrent - a.expCurrent)
            if (topList.length == 0) {
              topListDesc.push(`**Kayıt yok!**`)
            }
            topList.slice(0, 10).forEach(rank => {
              topListDesc.push(`${i++}. <@${rank.id}>\n✧ XP: \`${shortNumber(parseInt(rank.expCurrent))}/${shortNumber(parseInt(rank.expMax))}\`\n✧ Level: \`${rank.level}\`\n`)
            });
            kategoriDescs[kategori] = topListDesc;
          });

          let embed = new Discord.MessageEmbed()
            .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
            .setDescription(moment().utcOffset(3).format('MMMM YYYY'))
            .setTitle("Aylık En İyi 10 Sıralama")
            .setColor("2f3136")

          Object.keys(kategoriDescs).forEach(name => {
            embed.addField(name.toUpperCase(), kategoriDescs[name], true)
          });

          if (!lastMessage || lastMessage.author.id != client.user.id) {
            top10Ch.send(embed)
          } else {
            function isFieldsSame(embed1, embed2) {
              let result = true;
              for (let i = 0; i < Math.max(embed1.fields.length, embed2.fields.length); i++) {
                if (!embed1.fields[i] || !embed2.fields[i]) return result = false;
                if (embed1.fields[i].value.replace(/\n/g, "") != embed2.fields[i].value.replace(/\n/g, "")) {
                  result = false;
                }
              }
              return result;
            }
            if (!isFieldsSame(lastMessage.embeds[0], embed)) {
              console.log("Aylık en iyi 10 mesajı düzenlendi.")
              lastMessage.edit(embed)
            }
          }
        })
        .catch(console.error);
    }
  }

  const guild = client.guilds.cache.find(g => g.id == ayarlar.sunucu);
  if (!guild) console.error("Ana sunucu bulunamadı! (ayarlar.sunucu).")
  else {
    //boosterları güncelle
    updateBoostersLog(guild)
    //top10logs
    client.setInterval(() => {
      client.updateTop10Log(guild)
    }, 2000);
  }



};

async function updateBoostersLog(guild) {
  const client = guild.client;
  let boosterCh = guild.channels.cache.find(c => c.name == "booster")
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

        Array.from(guild.roles.cache.find(r => r.name == ayarlar.roles.booster).members.keys()).forEach(userID => {
          if (!db.get(`boosters_${guild.id}.${userID}.timestamp`))
            db.set(`boosters_${guild.id}.${userID}.timestamp`, parseInt(moment().utcOffset(3).format("x")))
        });

        //
        console.log("Olympos Destekçileri Sayısı: ", Array.from(guild.roles.cache.find(r => r.name == ayarlar.roles.booster).members.keys()).length)

        let boostersDesc = [];
        let i = 1;
        let topList = await Array.from(guild.roles.cache.find(r => r.name == ayarlar.roles.booster).members.keys()).sort((a, b) => db.get(`boosters_${guild.id}.${a}.timestamp`) - db.get(`boosters_${guild.id}.${b}.timestamp`))
        topList.forEach(boosterID => {
          boostersDesc.push(i++ + ". " + "<@" + boosterID + ">")
        });

        if (!lastMessage || lastMessage.author.id != client.user.id) {
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

