const Discord = require('discord.js')
const moment = require('moment')
const client = new Discord.Client();

const botadi = "Olympos"

exports.run = async (bot, msg, args) => {
  let tarih = moment.utc(msg.createdAt).format('DD MM YYYY');

  let user = msg.mentions.users.first() || msg.author;

  let userinfo = {};
  userinfo.avatar = user.displayAvatarURL;
  userinfo.id = user.id;
  userinfo.status = user.presence.status.toString()
    .replace("dnd", `Rahatsız Etmeyin`)
    .replace("online", `Çevrimiçi`)
    .replace("idle", `Boşta`)
    .replace("offline", `Çevrimdışı`)
  userinfo.bot = user.bot.toString()
    .replace("false", `Hayır`)
    .replace("true", `Evet`)
  userinfo.sonmesaj = user.lastMessage || "Son mesaj mevcut değil." || "Son yazılan mesaj bulunamadı."

  userinfo.dckayıt = moment.utc(msg.guild.members.cache.get(user.id).user.createdAt).format('**YYYY** [Yılında] MMMM [Ayında] dddd [Gününde] (**DD/MM/YYYY**)')
    .replace("Monday", `**Pazartesi**`)
    .replace("Tuesday", `**Salı**`)
    .replace("Wednesday", `**Çarşamba**`)
    .replace("Thursday", `**Perşembe**`)
    .replace("Friday", `**Cuma**`)
    .replace("Saturday", `**Cumartesi**`)
    .replace("Sunday", `**Pazar**`)
    .replace("January", `**Ocak**`)
    .replace("February", `**Şubat**`)
    .replace("March", `**Mart**`)
    .replace("April", `**Nisan**`)
    .replace("May", `**Mayıs**`)
    .replace("June", `**Haziran**`)
    .replace("July", `**Temmuz**`)
    .replace("August", `**Ağustos**`)
    .replace("September", `**Eylül**`)
    .replace("October", `**Ekim**`)
    .replace("November", `**Kasım**`)
    .replace("December", `**Aralık**`)
  userinfo.serverkayıt = moment.utc(msg.guild.members.cache.get(user.id).joinedAt).format('**YYYY** [Yılında] MMMM [Ayında] dddd [Gününde] (**DD/MM/YYYY**)')
    .replace("Monday", `**Pazartesi**`)
    .replace("Tuesday", `**Salı**`)
    .replace("Wednesday", `**Çarşamba**`)
    .replace("Thursday", `**Perşembe**`)
    .replace("Friday", `**Cuma**`)
    .replace("Saturday", `**Cumartesi**`)
    .replace("Sunday", `**Pazar**`)
    .replace("January", `**Ocak**`)
    .replace("February", `**Şubat**`)
    .replace("March", `**Mart**`)
    .replace("April", `**Nisan**`)
    .replace("May", `**Mayıs**`)
    .replace("June", `**Haziran**`)
    .replace("July", `**Temmuz**`)
    .replace("August", `**Ağustos**`)
    .replace("September", `**Eylül**`)
    .replace("October", `**Ekim**`)
    .replace("November", `**Kasım**`)
    .replace("December", `**Aralık**`)
  const uembed = new Discord.MessageEmbed()
    .setAuthor(user.tag, userinfo.avatar)
    .setThumbnail(userinfo.avatar)
    .setTitle('Kullanıcı:')
    .addField(`Durum`, userinfo.status, false)
    .setColor('2f3136')
    .addField(`Discord'a Katılım`, userinfo.dckayıt, false)
    .addField(`Sunucuya Katılım`, userinfo.serverkayıt, false)
    .addField(`Roller:`, `${msg.guild.members.cache.get(user.id).roles.cache.filter(r => r.name !== "@everyone").map(r => r).join(' **|** ') || "**Bu kullanıcıda hiçbir rol bulunmuyor**"}`, false)
  msg.channel.send(uembed)
}
exports.conf = {
  perms: ["Apollo", "Artemis"],
  // => Yetkisiz komut: @everyone
  // => Sadece kayıtlılar: ["Apollo", "Artemis"]
  enabled: true,
  guildOnly: true,
  aliases: []
};
exports.help = {
  name: 'kbilgi',
  description: 'İstediğiniz kullanıcının bilgilerini gösterir.',
  usage: 'kbilgi'
};

//BU KOMUT CODARE SUNUCUSUNDAN YUSUF A AİTTİR VE OLYMPOS TARAFINDAN EDİTLENMİŞTİR.