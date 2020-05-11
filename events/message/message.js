const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const moment = require("moment");
const fs = require("fs");

module.exports = async (message = new Discord.Message()) => {
    let client = message.client;

    if (message.author.bot) { // BOT SPAM KORUMA          // || message.author.id == "133191597683638273"
        if (message.channel.name == "botlar-arası") {
            // her hangi bi bot botlar-arası dan mesaj atmış
            if (ayarlar.ourBotsIDs.some(id => id == message.author.id)) {
                // bizim botumuz atmış yeey
                komutİşle();
            }
        }
        return; // botlardan gelen mesajları işleme
    }

    ////////////////////
    /* ↓  CAPSLOCK  ↓ */
    ////////////////////
    function capslockSay(str) { return (str.match(/[A-ZĞÜŞİÖÇ]/g) || []).length }
    if (!ayarlar.sahipIDs.some(id => id == message.author.id) && capslockSay(message.content) > 12) {
        if (["instagram", "spotify", "steam", "müzik-komutları"].some(c => c == message.channel.name))
            return; // üstteki kanallarda kontrol yapma
        await message.delete();
        return await message.channel.send(new Discord.MessageEmbed().setDescription("<@" + message.author.id + "> lütfen capslock kullanmayınız!").setColor("2f3136"))
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
        return str.split(" ").some(r => kısa.split(/\r?\n/).includes(r)) || uzun.split(/\r?\n/).some(k => k && str.includes(k))
    }
    if (!ayarlar.sahipIDs.some(id => id == message.author.id) && küfürVarMı(message.content.toLowerCase())) {
        await message.delete();
        return await message.channel.send(new Discord.MessageEmbed().setDescription("<@" + message.author.id + "> lütfen küfür etmeyiniz.").setColor("2f3136"))
    }
    ////////////////////
    /* ↑   KÜFÜR    ↑ */
    ////////////////////

    ////////////////////
    /* ↓   AFK MI   ↓ */
    ////////////////////
    if (message.mentions.members.find(m => db.has(`afk_${message.guild.id}.${m.id}`))) {
        let afkEmbed = new Discord.MessageEmbed()
            //.setTitle(`Bahsettiğiniz kişilerden afk olanlar var!`)
            .setColor(ayarlar.renk)

        let now = moment().utcOffset(3)
        let nowY = parseInt(now.format('YYYY'))
        let nowM = parseInt(now.format('MM'))
        let nowD = parseInt(now.format('DD'))
        let nowH = parseInt(now.format('HH'))
        let nowm = parseInt(now.format('mm'))
        let nowS = parseInt(now.format('ss'))
        let afkÜyeler = await message.mentions.members.filter(m => db.has(`afk_${message.guild.id}.${m.id}`));
        await afkÜyeler.forEach(async etiketÜye => {
            let afk = db.get(`afk_${message.guild.id}.${etiketÜye.user.id}`);
            let time = moment(afk.timestamp, 'x').utcOffset(3);
            let timeY = parseInt(time.format('YYYY'))
            let timeM = parseInt(time.format('MM'))
            let timeD = parseInt(time.format('DD'))
            let timeH = parseInt(time.format('HH'))
            let timem = parseInt(time.format('mm'))
            let timeS = parseInt(time.format('ss'))

            let y = nowY - timeY;
            y = (y < 0) ? (2000 + y) : y;
            let M = nowM - timeM;
            M = (M < 0) ? (12 + M) : M;
            let d = nowD - timeD;
            d = (d < 0) ? (30 + d) : d;
            let h = nowH - timeH;
            h = (h < 0) ? (24 + h) : h;
            let m = nowm - timem;
            m = (m < 0) ? (60 + m) : m;
            let s = nowS - timeS;
            s = (s < 0) ? (60 + s) : s;

            if (afkÜyeler.size == 1) {
                afkEmbed.setAuthor(`${etiketÜye.displayName.replace("[AFK]", "").trim()}`, etiketÜye.user.displayAvatarURL({ dynamic: true }))
                afkEmbed.setDescription(`__**${afk.sebep}**__ sebebiyle ${y ? `**${y}** yıl ` : ""}${M ? `**${M}** ay ` : ""}${d ? `**${d}** gün ` : ""}${h ? `**${h}** saat ` : ""}${m ? `**${m}** dakika ` : ""}**${s}** saniyedir AFK!`)
            } else {
                afkEmbed.addField(`**${etiketÜye.displayName.replace("[AFK]", "").trim()}**`, `__**${afk.sebep}**__ sebebiyle ${y ? `**${y}** yıl ` : ""}${M ? `**${M}** ay ` : ""}${d ? `**${d}** gün ` : ""}${h ? `**${h}** saat ` : ""}${m ? `**${m}** dakika ` : ""}**${s}** saniyedir AFK!`)
            }

        });

        await message.channel.send(`<@${message.author.id}>`, { embed: afkEmbed })
    }
    ////////////////////
    /* ↑   AFK MI   ↑ */
    ////////////////////

    ////////////////////
    /* ↓ DOĞUM GÜNÜ ↓ */
    ////////////////////
    if (message.channel.name == "doğum-günü") {
        let aylar = ["ocak", "şubat", "mart", "nisan", "mayıs", "haziran", "temmuz", "ağustos", "eylül", "ekim", "kasım", "aralık"]

        if (!db.has("dg_" + message.guild.id)) db.set("dg_" + message.guild.id, {})

        if (Object.values(db.get("dg_" + message.guild.id)).some(ids => ids.some(id => id == message.author.id))) {
            let currentDg = Object.keys(db.get("dg_" + message.guild.id)).find(gün => db.get("dg_" + message.guild.id + "." + gün).some(id => id == message.author.id));
            let currentAy = aylar[parseInt(currentDg.slice(0, 2)) - 1]
            currentAy = currentAy[0].toUpperCase() + currentAy.slice(1);
            let currentGün = parseInt(currentDg.slice(2)).toString();

            return message.reply(new Discord.MessageEmbed()
                .setTitle(`\\🎂 Doğum günü kaydınız zaten var!`)
                .setDescription("```" + " ".repeat((36 - (currentGün.length + 1 + currentAy.length)) / 2) + currentGün + " " + currentAy + "```\n**Yanlış kaydettiyseniz lütfen yetkililere başvurun.**")
                .setColor("PURPLE")
            )

        }


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
        //console.log(kayıtTxt)

        let b = new Date(aySayı + "/" + gün + "/2000")
        Date.prototype.isValid = function () { return this.getTime() === this.getTime(); };
        if (!b.isValid() || b.getMonth() + 1 != aySayı) {
            return message.reply(new Discord.MessageEmbed()
                .setTitle(`\\🎂 Hatalı bir tarih girdiniz!`)
                .setDescription(`Lütfen geçerli gün ve ay olacak şeklinde mesaj gönderiniz.`)
                .setColor("RED")
            )
        }

        await db.push("dg_" + message.guild.id + "." + kayıtTxt, message.author.id)

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

    komutİşle();

    function komutİşle() {
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
            if (!message.guild && !message.author.bot) {
                if (cmd.conf.guildOnly) {
                    const ozelmesajuyari = new Discord.MessageEmbed()
                        .setColor(484848)
                        .setTimestamp()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setTitle("Bu komut özel mesajlarda kullanılamaz.");
                    return message.author.send(ozelmesajuyari);
                } else {
                    if (!message.author.bot) { //  && message.author.id != "133191597683638273"
                        yetkiliKontrol(message, cmd, args, cmd.conf.perms);
                    } else {
                        cmd.run(client, message, args);
                    }
                }
            } else {
                if (!cmd.conf.perms)
                    cmd.conf.perms = ["@everyone"]
                if (!message.author.bot) { //  && message.author.id != "133191597683638273"
                    yetkiliKontrol(message, cmd, args, cmd.conf.perms);
                } else {
                    cmd.run(client, message, args);
                }
            }
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
        ).then(msg => msg.delete({ timeout: 10000 }));

    cmd.run(client, message, args);
}
