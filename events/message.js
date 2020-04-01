const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const moment = require("moment");
const fs = require("fs");


module.exports = async message => {
  let client = message.client;

  if (message.author.bot) return; // BOT SPAM KORUMA

  ////////////////////
  /* ↓  CAPSLOCK  ↓ */
  ////////////////////
  function capslockSay(str) {return (str.match(/[A-ZĞÜŞİÖÇ]/g) || []).length}
  if (!ayarlar.sahipIDs.some(id=>id == message.author.id) && capslockSay(message.content) > 12) {
    await message.delete();
    return await message.reply("Lütfen capslock kullanmayınız!")
  }
  ////////////////////
  /* ↑  CAPSLOCK  ↑ */
  ////////////////////

  ////////////////////
  /* ↓   KÜFÜR    ↓ */
  ////////////////////
  function küfürVarMı(str) {
    const kısa = fs.readFileSync('/app/küfürlerEşit.txt', 'UTF-8');
    const uzun = fs.readFileSync('/app/küfürlerİçinde.txt', 'UTF-8');
    return str.split(" ").some(r=> kısa.split(/\r?\n/).includes(r)) || uzun.split(/\r?\n/).some(k => k && str.includes(k))
  }
  if (!ayarlar.sahipIDs.some(id=>id == message.author.id) && küfürVarMı(message.content.toLowerCase())) {
    await message.delete();
    return await message.reply("Küfür detected")
  }
  ////////////////////
  /* ↑   KÜFÜR    ↑ */
  ////////////////////

  ////////////////////
  /* ↓   AFK MI   ↓ */
  ////////////////////
  if (message.mentions.members.find(m => db.has(`afk_${message.guild.id}.${m.id}`))) {
    let afkEmbed = new Discord.MessageEmbed()
      .setTitle(`Bahsettiğiniz kişilerden afk olanlar var!`)

    let desc = []

    await message.mentions.members.filter(m => db.has(`afk_${message.guild.id}.${m.id}`)).forEach(async etiketÜye => {
      await desc.push("<@" + etiketÜye.user.id + ">: _" + db.get(`afk_${message.guild.id}.${etiketÜye.user.id}`) + "_")
    });

    await afkEmbed.setDescription(desc.join("\n"))

    await message.reply(afkEmbed)
  }
  ////////////////////
  /* ↑   AFK MI   ↑ */
  ////////////////////

  ////////////////////
  /* ↓ DOĞUM GÜNÜ ↓ */
  ////////////////////
  if (message.channel.name == "doğum-günü") {
    if (!db.has("dg_" + message.guild.id)) db.set("dg_" + message.guild.id, {})

    if (Object.values(db.get("dg_" + message.guild.id)).some(ids => ids.some(id => id == message.author.id)))
      return message.reply(new Discord.MessageEmbed()
        .setTitle(`\\🎂 Doğum günü kaydınız zaten var!`)
        .setDescription(`**Yanlış kaydettiyseniz lütfen yetkililere başvurun.**`)
        .setColor("PURPLE")
      )

    let aylar = ["ocak", "şubat", "mart", "nisan", "mayıs", "haziran", "temmuz", "ağustos", "eylül", "ekim", "kasım", "aralık"]

    let args = [];
    message.content.split(" ").forEach(arg => {
      if (arg) args.push(arg);
    });

    if (args.length != 2) {
      return message.reply(new Discord.MessageEmbed()
        .setTitle(`\\🎂 Eksik ya da fazla kelime girdiniz!`)
        .setDescription(`Lütfen sadece gün ve ay şeklinde mesaj gönderiniz.`)
        .addField(`✧✧✧✧✧✧✧ doğru bir mesaj örneği ✧✧✧✧✧✧✧`, "```              23 şubat```")
        .setColor("RED")
      )
    }

    let gün = parseInt(args[0]).toString();
    let ay = args[1].replace("I", "ı").toLowerCase();


    if (!gün.match(/^[0-9\b]+$/) || gün.length > 2 || !aylar.some(a => a == ay)) {
      return message.reply(new Discord.MessageEmbed()
        .setTitle(`\\🎂 Yanlış gün veya ay adı girdiniz!`)
        .setDescription(`Lütfen doğru gün ve ay şeklinde mesaj gönderiniz.`)
        .addField(`✧✧✧✧✧✧✧ doğru bir mesaj örneği ✧✧✧✧✧✧✧`, "```              23 şubat```")
        .setColor("RED")
      )
    }

    let günTxt, ayTxt;
    if (gün.toString().length == 1) günTxt = "0" + gün; // 09
    else günTxt = gün;
    let aySayı = aylar.indexOf(ay) + 1;
    if (aySayı.toString().length == 1) ayTxt = "0" + aySayı; // 02
    else ayTxt = aySayı;
    let kayıtTxt = ayTxt.toString() + günTxt.toString(); //0209
    console.log(kayıtTxt)

    let b = new Date(aySayı + "/" + gün + "/2000")
    Date.prototype.isValid = function () { return this.getTime() === this.getTime(); };
    if (!b.isValid() || b.getMonth() + 1 != aySayı) {
      return message.reply(new Discord.MessageEmbed()
        .setTitle(`\\🎂 Hatalı bir tarih girdiniz!`)
        .setDescription(`Lütfen geçerli gün ve ay olacak şeklinde mesaj gönderiniz.`)
        .setColor("RED")
      )
    }

    await console.log(db.push("dg_" + message.guild.id + "." + kayıtTxt, message.author.id))

    await message.reply(new Discord.MessageEmbed()
      .setTitle(`\\🎂 Doğum günü kaydınız başarıyla alınmıştır!`)
      .setColor("GREEN")
    )

    await console.log("DG KAYDI: " + gün + " " + ay + " : " + message.author.tag)

    if (kayıtTxt == moment().utcOffset(3).format("MMDD")) {
      // bu gün doğum günüymüş
      let dgRol = message.guild.roles.cache.find(r => r.name == ayarlar.dgRolü)
      message.member.roles.add(dgRol)
    }


    return; // Doğum günü kanalında başka işlem geçerli olmasın. (komutlar çalışmaz)
  }
  ////////////////////
  /* ↑ DOĞUM GÜNÜ ↑ */
  ////////////////////


  if (!message.content.startsWith(ayarlar.prefix)) return; // KOMUT DEĞİLSE DEVAMI GELMESİN

  let command = message.content.split(" ")[0].slice(ayarlar.prefix.length);
  let args = message.content.split(" ").slice(1);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (!message.guild) {
      if (cmd.conf.guildOnly) {
        const ozelmesajuyari = new Discord.MessageEmbed()
          .setColor(484848)
          .setTimestamp()
          .setAuthor(message.author.username, message.author.avatarURL)
          .setTitle("Bu komut özel mesajlarda kullanılamaz.");
        return message.author.send(ozelmesajuyari);
      } else {
        cmd.run(client, message, args);
      }
    } else {
      if (!cmd.conf.perms)
        cmd.conf.perms = ["@everyone"]
      yetkiliKontrol(message, cmd, args, cmd.conf.perms);
    }
  }
};

function yetkiliKontrol(message, cmd, args, yetkiliRoller) {
  let client = message.client;
  let yetkiliMi = false;

  yetkiliRoller.forEach(rol => {
    if (message.member.roles.cache.find(r => r.name == rol)) yetkiliMi = true;
  });

  if (!yetkiliMi)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`Yetkin yok maalesef (ಥ﹏ಥ)'`)
        .setColor(484848)
        .setTimestamp()
    )
      .then(msg => msg.delete({ timeout: 10000 }));

  cmd.run(client, message, args);
}
