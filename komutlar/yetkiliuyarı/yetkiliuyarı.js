const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const fs = require('fs');

exports.run = async (client, message, args) => {

    let user = message.mentions.members.first();

    if (!user)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${ayarlar.prefix}yetkiliuyar _@kullanıcı_ uyarıSayısı kuralNo`)
            .setColor(484848)
        ).then(msg => msg.delete({ timeout: 10000 }));

    if (args.length < 3)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${ayarlar.prefix}yetkiliuyar _@kullanıcı_ uyarıSayısı kuralNo`)
            .setColor(484848)
        ).then(msg => msg.delete({ timeout: 10000 }));

    //////////////////////////////////////////
    /* YETKİ SIRALAMASI KONTROLÜ BAŞLANGICI */
    //////////////////////////////////////////

    let authorMaxRoleID = 0;
    let targetMaxRoleID = 0;

    message.member.roles.cache.forEach(role => {
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

    ////////////////////
    /* KOD BAŞLANGICI */
    ////////////////////

    let uyarıSayısı = args[1];
    if (!uyarıSayısı.match(/^[0-9\b]+$/) || parseFloat(uyarıSayısı) == 0)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(
                    `**Geçerli bir uyarı sayısı girilmemiş ◑.◑**\n\n_Örnek:_ ` +
                    ayarlar.prefix +
                    `yetkiliuyarı **@nick** uyarıSayısı kuralNo`
                )
                .setColor(10038562)
                .setTimestamp()
        );
    uyarıSayısı = parseFloat(uyarıSayısı)
    let kuralNo = args[2];
    if (!kuralNo.match(/^[0-9\b]+$/) || parseFloat(kuralNo) == 0)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(
                    `**Geçerli bir kural numarası girilmemiş ◑.◑**\n\n_Örnek:_ ` +
                    ayarlar.prefix +
                    `yetkiliuyarı **@nick** uyarıSayısı kuralNo`
                )
                .setColor(10038562)
                .setTimestamp()
        );
    kuralNo = parseFloat(kuralNo)


    const kurallar = fs.readFileSync('/app/yetkiliKuralları.txt', 'UTF-8').split("♥")
    if (!kurallar[kuralNo - 1])
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(
                    `**Girilen numaraya ait bir kural bulunamadı ◑.◑**`
                )
                .setColor(10038562)
                .setTimestamp()
        );

    let rolünVarsayılanDeğeriYoksaVerilecekVarsayılanUyarıSayısı = 2;
    // => Kişinin en yüksek rolünün varsayılan uyarı sayısı önceden belirlenmediyse hatanın önüne geçmek gerek :)

    let db_uyarıSayısı = new db.table("uyarıSayısı"); // { user.id : uyarıSayısı }
    let db_varsayılanUyarıSayıları = new db.table("uyarıSayısı_varsayılan"); // { role.name : uyarıSayısı }
    // => Veritabanında bu komuta özel tablolar

    let topRole = message.guild.roles.cache.find(r => r.position == targetMaxRoleID);
    // => Kişinin önceden kayıtlı uyarı sayısı yoksa en yüksek rolüne göre uyarı sayısı verileceği için en yüksek rolünü hesapladık.

    if (!ayarlar.perms.yetkili.some(y => y == topRole.name))
        return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(
                    `**Seçilen kişi yetkili değil ◑.◑**`
                )
                .setColor(10038562)
                .setTimestamp()
        );

    let userUyarıSayısı;
    // => Kişinin sahip olduğu maksimum uyarı sayısı

    if (db_uyarıSayısı.has(user.id)) {
        userUyarıSayısı = db_uyarıSayısı.get(user.id);
    } else {
        if (db_varsayılanUyarıSayıları.has(topRole.name)) {
            userUyarıSayısı = db_varsayılanUyarıSayıları.get(topRole.name);
        } else {
            userUyarıSayısı = rolünVarsayılanDeğeriYoksaVerilecekVarsayılanUyarıSayısı;
        }
    }

    if (userUyarıSayısı <= 0) {
        // => Bu adam sınırını zaten aşmış!

        userUyarıSayısı = 0;
        // => Negatif sayılarla uğraşmayalım boşuna..

        message.reply("Kanka bu adam uyarı sınırını çoktan aşmış, hala cezasını vermeyecek misin !?!")
    } else {
        // => Uyarı sayısını düşelim.
        userUyarıSayısı -= uyarıSayısı;

        if (userUyarıSayısı <= 0) {
            // => Bu adam şimdi sınırını aştı!

            userUyarıSayısı = 0;
            // => Negatif sayılarla uğraşmayalım boşuna..

            message.reply("Adamı uyarılarınla yok ettin bro, cezasını kesme vakti!")
        } else {
            // => Hala uyarı hakkı var, devamke!

            message.channel.send("<@" + user + "> hala bir umut var.. Şafak: " + userUyarıSayısı)
        }
    }

    db_uyarıSayısı.set(user.id, userUyarıSayısı);


    let embed1 = new Discord.MessageEmbed()
        .setTitle(`YETKİLİ UYARI SİSTEMİ`)
        .setDescription(`<@${user.id}> yetkilisine <@${message.author.id}> tarafından **` + uyarıSayısı + ` uyarı** verildi.`)
        .setColor("000")
        .setTimestamp();

    if (kurallar[kuralNo - 1]) {
        embed1.addField("İhlal Edilen Kural", kurallar[kuralNo - 1])
    }

    let yetkiliUyarıCh = message.guild.channels.cache.find(c => c.name == "yetkili-uyarı");
    if (yetkiliUyarıCh)
        yetkiliUyarıCh.send(embed1)

};

exports.conf = {
    perms: ["Zeus", "POSEIDON", "Hera", "Hades"],
    // => Yetkisiz komut: ["@everyone"]
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
    enabled: true,
    guildOnly: true,
    aliases: ['yu']
};

exports.help = {
    name: 'yetkiliuyarı',
    description: 'Belirttiğiniz kişiye belirtilen sayı kadar uyarı ekler.',
    usage: 'yetkiliuyarı kullanıcı süre kuralNo'
};