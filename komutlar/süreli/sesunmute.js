const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar.json");
const db = require("quick.db");
const moment = require("moment");

exports.run = (client, message, args) => {
  let user = message.mentions.members.first();

  if (!user)
    return message.channel
      .send(
        new Discord.MessageEmbed()
          .setDescription(
            `Örnek: **${ayarlar.prefix}sesunmute @kullanıcı**`
          )
          .setColor(484848)
      )
      .then(msg => msg.delete({ timeout: 10000 }));

  
  //////////////////////////////////////////
    /* YETKİ SIRALAMASI KONTROLÜ BAŞLANGICI */
    //////////////////////////////////////////

    let authorMaxRoleID = 0;
    let targetMaxRoleID = 0;

    message.member.roles.cache.forEach(role => {
      if (ayarlar.perms.yetkisizAraRoller.some(r=>r==role.name)) return console.log(role.name + " rolü yok sayıldı.");
        if (authorMaxRoleID < role.position)
            authorMaxRoleID = role.position
    });

    user.roles.cache.forEach(role => {
      if (ayarlar.perms.yetkisizAraRoller.some(r=>r==role.name)) return console.log(role.name + " rolü yok sayıldı.");
        if (targetMaxRoleID < role.position)
            targetMaxRoleID = role.position
    });

    if (authorMaxRoleID <= targetMaxRoleID)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`Maalesef seçtiğin kişiye bu komutu uygulayamazsın (ಥ﹏ಥ)'`)
            .setColor(484848)
            .setTimestamp()
        ).then(msg => msg.delete({ timeout: 10000 }));

    //////////////////////////////////////////
    /*    YETKİ SIRALAMASI KONTROLÜ SONU    */
    //////////////////////////////////////////


  let süreliDb = new db.table("sesmute");
  süreliDb.set(
    user.id + ".cezaBitiş",
    parseInt(moment().format("x"))
  );
  süreliDb.set(user.id + ".msgChID", message.channel.id);


};

exports.conf = {
  perms: ayarlar.perms.yetkili,
  enabled: true,
  guildOnly: true,
  aliases: ["sesunmute"],
};

exports.help = {
  name: "sesunmute",
  description: "Belirttiğiniz kişinin ses mute cezasını bitirir.",
  usage: "sesunmute kullanıcı süre sebep"
};
