const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar")

exports.run = (client, message, args) => {
  let mesaj = args.slice(0).join(" ");
  if (mesaj.length < 1) return message.channel.send("İçeriğini yazmalısın.");

  message.delete();

  console.log(
    `Duyuru: "${message.author.username}#${message.author.discriminator}" "${mesaj}"`
  );

  client.users.cache.forEach(u => {
    if (u.bot) return;
    u.send("" + mesaj + "").catch(err => {
      message.channel.send("hata: " + u.username + " == " + err.message);
    });
  });

  message.channel.send(
    `:white_check_mark: Mesaj basariyla **` +
    client.guilds.cache
      .reduce((a, b) => a + b.memberCount, 0)
      .toLocaleString() +
    `** kullanıcıya gönderildi.`
  );
};

exports.conf = {
  perms: ayarlar.perms.üst,
  // => Yetkisiz komut: ["@everyone"]
  // => Sadece kayıtlılar: ["Apollo", "Artemis"]
  enabled: true,
  guildOnly: true,
  aliases: ["toplumesaj"]
};

exports.help = {
  name: "topludm",
  description: "Sunucudaki herkese mesaj atar.",
  usage: "topludm"
};
