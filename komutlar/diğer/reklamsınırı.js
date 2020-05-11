const db = require("quick.db");
const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
  const sınır = args.slice(0).join(" ");

  if (!sınır)
    return message.channel.send(
      "Reklam sınırı sayısını da yazmalısın."
    );

  db.set(`reklamsınır_${message.guild.id}`, sınır);
  db.set(`reklambanayar_${message.guild.id}`, "acik");
  const dbsınır = await db.get(`reklamsınır_${message.guild.id}`);
  message.channel.send(`Reklam sınırı \`${dbsınır}\` olarak ayarlandı.`);
};

exports.conf = {
    perms: ["Zeus", "POSEIDON"],
    // => Yetkisiz komut: @everyone
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
  enabled: true,
  guildOnly: false,
  aliases: ["reklambansınırı"]
};

exports.help = {
  name: "reklamsınırı",
  description: "Reklam ban sisteminin sınırını belirler.",
  usage: "reklamsınırı <sayı>"
};