const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");
const db = require("quick.db");
const moment = require("moment");

exports.run = (client, message, args) => {
  let guild = message.guild;

  if (!guild) guild = client.guilds.cache.find(g => g.id == ayarlar.sunucu);
  if (!guild) return console.error("Ana sunucu bulunamadı! (ayarlar.sunucu). mute komutu dm üzerinden çalışmadı.")

  let messageMember = message.member;

  if (!messageMember) {
    messageMember = guild.member(message.author);
  }
  if (!messageMember) {
    return;
  }

  let user = message.mentions.members.first();

  if (!user)
    return message.channel
      .send(
        new Discord.MessageEmbed()
          .setDescription(
            `Örnek: **${ayarlar.prefix}mute @kullanıcı 10 sebep**`
          )
          .setColor(484848)
      )
      .then(msg => msg.delete({ timeout: 10000 }));

  if (args.length < 3)
    return message.channel
      .send(
        new Discord.MessageEmbed()
          .setDescription(
            `$Örnek: **${ayarlar.prefix}mute @kullanıcı 10 sebep**`
          )
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
          `mute **@nick** süre(sadeceSayı) sebep`
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

  messageMember.roles.cache.forEach(role => {
    if (ayarlar.perms.yetkisizAraRoller.some(r => r == role.name)) return console.log(role.name + " rolü yok sayıldı.");
    if (authorMaxRoleID < role.position)
      authorMaxRoleID = role.position
  });

  user.roles.cache.forEach(role => {
    if (ayarlar.perms.yetkisizAraRoller.some(r => r == role.name)) return console.log(role.name + " rolü yok sayıldı.");
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

  // MUTED
  guild.channels.cache.filter(c => c.type == "text").forEach(channel => {

    channel.updateOverwrite(user.id,
      {
        SEND_MESSAGES: false
      }
    );
  });

  user.setNickname(user.displayName.replace("[MUTED]", "") + " [MUTED]")

  let süreliDb = new db.table("mute");
  süreliDb.set(user.id + ".cezaBitiş", parseInt(moment().format("x")) + sure * 60 * 1000);
  süreliDb.set(user.id + ".msgChID", message.channel.id);
  süreliDb.set(user.id + ".cezaVerenID", message.author.id);

  let embed1 = new Discord.MessageEmbed()
    .setTitle(`🔒 CHAT MUTE`)
    .setDescription(`<@${user.id}> kullanıcısı <@${message.author.id}> tarafından **` + sure + ` dakika** susturuldu.\n\n**SEBEP: **_` + sebep + `_`)
    .setColor("000")
    .setTimestamp();

  message.channel.send(embed1).then(msg => {
    //msg.delete({ timeout: 10000 })
    let cezaBilgi = msg.guild.channels.cache.find(c => c.name == 'ceza-bilgi');
    if (cezaBilgi)
      cezaBilgi.send(embed1).catch(er => console.error)
    else
      console.error("ceza-bilgi kanalını bulamadım")
  });



};

exports.conf = {
  perms: ayarlar.perms.yetkili,
  enabled: true,
  guildOnly: true,
  aliases: ["mute"],
};

exports.help = {
  name: "mute",
  description: "Belirttiğiniz kişinin yazmasını tüm kanallarda kapatır.",
  usage: "mute kullanıcı süre sebep"
};
