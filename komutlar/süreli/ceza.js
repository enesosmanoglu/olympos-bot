const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");
const db = require("quick.db");
const moment = require("moment");

exports.run = async (client, message, args) => {
  let user = message.mentions.members.first();

  if (!user)
    return message.channel
      .send(
        new Discord.MessageEmbed()
          .setDescription(`${ayarlar.prefix}ceza @kullanıcı süre(dk) sebep`)
          .setColor(484848)
      )
      .then(msg => msg.delete({ timeout: 10000 }));

  if (args.length < 3)
    return message.channel
      .send(
        new Discord.MessageEmbed()
          .setDescription(`${ayarlar.prefix}ceza @kullanıcı süre(dk) sebep`)
          .setColor(484848)
      )
      .then(msg => msg.delete({ timeout: 10000 }));

  let sure = args[1];
  if (!sure.match(/^[0-9.\b]+$/) || parseFloat(sure) == 0)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `**Geçerli bir süre girilmemiş ◑.◑**\n\n_Örnek:_ ` +
            ayarlar.prefix +
            `ceza **@nick** süre(sadeceSayı) sebep`
        )
        .setColor(10038562)
        .setTimestamp()
    );
  sure = parseFloat(sure)
  let sebep = args.slice(2, args.length).join(" ");
  
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

  // CEZA
  
  user.voice.setChannel(null)
  
  let oncekiRoller = [];

  user.roles.cache.forEach(role => {
    if (role.name=="Cezalı") return
    oncekiRoller.push(role);
    console.log(role.name)
  });

  //user.roles.remove(oncekiRoller, sebep);

  let roleCezalı = user.guild.roles.cache.find(r => r.name == 'Cezalı');
  if (!roleCezalı) console.error("Cezalı rolü bulunamadı")
   user.roles.set([roleCezalı], sebep);

  
  let cezaDb = new db.table("ceza");
  cezaDb.set(user.id, {
    cezaBitiş: parseInt(moment().format("x")) + sure * 60 * 1000,
    msgChID: message.channel.id
  });
  oncekiRoller.forEach(role => {
    cezaDb.push(user.id + ".roller", role.name);
  });
  if (oncekiRoller.length == 0) cezaDb.push(user.id + ".roller", "@everyone");
  
  
  let embed1 = new Discord.MessageEmbed()
    .setTitle(`🔒 CEZA`)
    .setDescription(
        `<@${user.id}> kullanıcısı <@${message.author.id}> tarafından **` +
        sure +
        ` dakika** cezalandırıldı.\n\n**SEBEP: **_` +
        sebep +
        `_`
    )
    .setColor("000")
    .setTimestamp();

  message.channel.send(embed1)//.then(msg => msg.delete({ timeout: 10000 }));

  let cezaBilgi = message.guild.channels.cache.find(channel => channel.name === 'ceza-bilgi');
  if (cezaBilgi) cezaBilgi.send(embed1);
};

exports.conf = {
  perms: ayarlar.perms.yetkili,
  enabled: true,
  guildOnly: true,
  aliases: ["ceza"],
};

exports.help = {
  name: "ceza",
  description:
    "Belirttiğiniz kişinin tüm rollerini belirttiğiniz süre boyunca siler.",
  usage: "ceza kullanıcı süre sebep"
};
