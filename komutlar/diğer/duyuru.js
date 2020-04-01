const discord = require("discord.js");
const ayarlar = require("/app/ayarlar");
const prefix = ayarlar.prefix;

exports.run = async (client, message, args) => {
  let renk = args[0];
  let yazı = args.splice(1, args.length).join(" ");

  if (args.length < 1) {
    const embed = new discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setColor("RED")
      .setDescription(`${prefix}duyuru renk yazı`)
      .setTimestamp();
    message.channel.send(embed);
  }

  if (args[0] == "yardım") {
    const embedd = new discord.MessageEmbed()
      .setAuthor("Duyuru Yardım")
      .setColor("BLUE")
      .setDescription(`**${prefix}duyuru renk yazı**`)
      .setTimestamp();
    message.channel.send(embedd);
  }

  if (args[0] == "mavi") {
    const embedd = new discord.MessageEmbed()
      .setAuthor("DUYURU")
      .setColor("BLUE")
      .setDescription(yazı)
      .setTimestamp();
    message.channel.send(embedd);
    message.delete();
  }
  if (args[0] == "kırmızı") {
    const embedd = new discord.MessageEmbed()
      .setAuthor("DUYURU")
      .setColor("RED")
      .setDescription(yazı)
      .setTimestamp();
    message.channel.send(embedd);
    message.delete();
  }

  if (args[0] == "yeşil") {
    const embedd = new discord.MessageEmbed()
      .setAuthor("DUYURU")
      .setColor("GREEN")
      .setDescription(yazı)
      .setTimestamp();
    message.channel.send(embedd);
    message.delete();
  }
  if (args[0] == "turuncu") {
    const embedd = new discord.MessageEmbed()
      .setAuthor("DUYURU")
      .setColor("ORANGE")
      .setDescription(yazı)
      .setTimestamp();
    message.channel.send(embedd);
    message.delete();
  }
  if (args[0] == "random") {
    const embedd = new discord.MessageEmbed()
      .setAuthor("DUYURU")
      .setColor("RANDOM")
      .setDescription(yazı)
      .setTimestamp();
    message.channel.send(embedd);
    message.delete();
  }
};

exports.conf = {
  perms: ["Zeus"],
  // => Yetkisiz komut: @everyone
  // => Sadece kayıtlılar: ["Apollo", "Artemis"]
  aliases: ["duyuru"],
  enabled: true,
  guildOnly: false
};

exports.help = {
  name: "duyuru",
  category: "Kullanıcı",
  usage: "duyuru renk yazı"
};
