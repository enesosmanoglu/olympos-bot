const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("/app/ayarlar");
const moment = require("moment");
moment.locale("tr");

module.exports = async (oldMember, newMember) => {
  const client = oldMember.client;

  function getEmoji(emojiName, defaultEmoji) {
    let emoji = client.emojis.cache.find(e => e.name == emojiName);
    if (!emoji) emoji = ":" + defaultEmoji + ":"; // Üstteki emoji bulunamazsa varsayılan emoji (discord basic emojis)
    return emoji;
  }

  let emoji = getEmoji("konfeti", "small_orange_diamond");
  let emoji2 = getEmoji("aww", "wave");

  if (!oldMember.roles.cache.find(r => r.name == ayarlar.dgRolü) && newMember.roles.cache.find(r => r.name == ayarlar.dgRolü)) {
    // DGKO ROLÜ EKLENMİŞ
    newMember.send(new Discord.MessageEmbed()
      .setTitle(`${emoji} **DOĞUM GÜNÜN KUTLU OLSUN ${newMember.displayName.split("|")[0].slice(2).toUpperCase()}** ${emoji}`)
      .setDescription(`Bizi Olympos'ta yalnız bırakmadığın için biz de bu güzel gününde seni yalnız bırakmak istemedik. ${emoji2}`)
      .addField(`Sunucuda senin için neler değişti?`, `• Doğum günü rolü verildi, bugünlük kendini sağ üstlerde görebilirsin.\n• Sunucuda kayıtlı yaşın 1 artırıldı.`)
      .addField(`✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧`, "```      🎂 İyi ki doğdun, iyi ki bizimlesin. 🎂```")
      .setColor("BLACK")
      .setImage("https://i.hizliresim.com/A0nfXV.png")
    )

    let genelChat = newMember.guild.channels.cache.find(c => c.name == "genel-chat");
    if (genelChat) genelChat.send(new Discord.MessageEmbed()
      .setDescription(`${emoji} **DOĞUM GÜNÜN KUTLU OLSUN ${newMember.user}** ${emoji}`)
      .addField(`✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧${moment().utcOffset(3).format("D MMMM")}✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧`, "```       🎂 İyi ki doğdun, iyi ki varsın. 🎂```")
      .setColor("#2f3136")
      .setThumbnail("https://i.hizliresim.com/RI8jZ8.gif")
    )


  }

};


