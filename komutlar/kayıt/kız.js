const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar.json");

var prefix = ayarlar.prefix;

exports.run = async (bot, message, params) => {
  let args = []
  params.forEach(param => {if (param) args.push(param)})
  
  let rMember =
    message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if (!rMember)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `**Kaydolacak kişiyi etiketlemelisin ◑.◑**\n\n_Örnek:_ ` +
            ayarlar.prefix +
            `kız **@nick** isim yaş`
        )
        .setColor(10038562)
        .setTimestamp()
    );
  
  if (args.length < 3) {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `**Eksik bilgi girdin ◑.◑**\n\n_Örnek:_ ` +
            ayarlar.prefix +
            `kız **@nick** isim yaş`
        )
        .setColor(10038562)
        .setTimestamp()
    );
  }
  if (args.length > 3) {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `**Fazla bilgi girdin ◑.◑**\n\n_Örnek:_ ` +
            ayarlar.prefix +
            `kız **@nick** isim yaş`
        )
        .setColor(10038562)
        .setTimestamp()
    );
  }

  let kayıtsızRol = message.guild.roles.cache.find(e => e.name == "Peasant of Olympos");
  if (!kayıtsızRol)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`*Peasant of Olympos* rolünü bulamıyorum. ●︿●`)
        .setColor(10038562)
        .setTimestamp()
    );

  let taglıRol = message.guild.roles.cache.find(e => e.name == "Elite of Olympos");
  if (!taglıRol)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`*Elite of Olympos* rolünü bulamıyorum. ●︿●`)
        .setColor(10038562)
        .setTimestamp()
    );
  let tagsızRol = message.guild.roles.cache.find(e => e.name == "Rebel of Olympos");
  if (!tagsızRol)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`*Rebel of Olympos* rolünü bulamıyorum. ●︿●`)
        .setColor(10038562)
        .setTimestamp()
    );

  if (rMember.roles.cache.has(taglıRol.id) || rMember.roles.cache.has(tagsızRol.id))
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription("Bu kullanıcı zaten **kayıtlı**.")
        .setColor(10038562)
    );
  
  let isim = args[1];
  let yaş = args[2];
  
  if (isim.length > 12)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `İsim için harf limiti **12**'dir!`
        )
        .setColor(10038562)
        .setTimestamp()
    );
  
  if (!isim.match(/^[A-Za-zğĞüÜşŞıİöÖçÇ]+$/))
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `**Geçerli bir isim girilmemiş ◑.◑**\n\n_Örnek:_ ` +
            ayarlar.prefix +
            `kız **@nick** **isim** yaş`
        )
        .setColor(10038562)
        .setTimestamp()
    );
  if (!yaş.match(/^[0-9]+$/))
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `**Geçerli bir yaş girilmemiş ◑.◑**\n\n_Örnek:_ ` +
            ayarlar.prefix +
            `kız **@nick** isim **yaş**`
        )
        .setColor(10038562)
        .setTimestamp()
    );
  
  isim = isim.charAt(0).toUpperCase() + isim.slice(1).replace("I","ı").toLowerCase();
  
  // Taglı tagsız kontrol
  let tag = "✧";
  let tag2 = "✦";
  let taglı = rMember.user.username.includes(tag);
  
  await rMember.setNickname((taglı ? tag : tag2) + " " + isim + " | " + yaş, "kayıt");

  let cinsiyetRol = message.guild.roles.cache.find(e => e.name == "Artemis");
  if (!cinsiyetRol)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`*Artemis* rolünü bulamıyorum. ●︿●`)
        .setColor(10038562)
        .setTimestamp()
    );

  if (rMember.roles.cache.has(cinsiyetRol.id))
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription("Bu kullanıcı zaten Artemis.")
        .setColor(10038562)
    );
await rMember.roles.add(cinsiyetRol);
  
  if (taglı)
    await rMember.roles.add(taglıRol);
  else 
    await rMember.roles.add(tagsızRol);
  
  await rMember.roles.remove(kayıtsızRol); 
  
  await message.channel.send(
    new Discord.MessageEmbed()
      .setDescription(`${rMember} **${taglı?"TAGLI":"TAGSIZ"} KIZ**  olarak kaydedildi.`)
      .setColor("000")
  );
};

exports.conf = {
    perms: ["Zeus", "POSEIDON", "Hera", "Hades", "Demeter", "Athena", "Ares", "Hephaistos", "Aphrodite", "Hermes", "Hestia","Dionysos"],
    // => Yetkisiz komut: @everyone
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
  enabled: true,
  guildOnly: false,
  aliases: ["k"]
};

exports.help = {
  name: "kız",
  description: "Kızları kayıt eder",
  usage: "kız <kullanici> isim yaş"
};
