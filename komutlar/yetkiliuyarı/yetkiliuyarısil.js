const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

exports.run = async (client, message, args) => {


    let user = message.mentions.members.first()

    if (!user)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${ayarlar.prefix}yetkiliuyarısil _@kullanıcı_ uyarıSayısı sebep`)
            .setColor(484848)
        ).then(msg => msg.delete({ timeout: 10000 }));

    if (args.length < 3)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`${ayarlar.prefix}yetkiliuyarısil _@kullanıcı_ uyarıSayısı sebep`)
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

    let uyarıSayısı = parseInt(args[1]);
    let sebep = args.slice(2, args.length).join(" ");

    let rolünVarsayılanDeğeriYoksaVerilecekVarsayılanUyarıSayısı = 2;
    // => Kişinin en yüksek rolünün varsayılan uyarı sayısı önceden belirlenmediyse hatanın önüne geçmek gerek :)

    let db_uyarıSayısı = new db.table("uyarıSayısı"); // { user.id : uyarıSayısı }
    let db_varsayılanUyarıSayıları = new db.table("uyarıSayısı_varsayılan"); // { role.name : uyarıSayısı }
    // => Veritabanında bu komuta özel tablolar

    let topRole = message.guild.roles.cache.find(r => r.position == targetMaxRoleID);
    // => Kişinin önceden kayıtlı uyarı sayısı yoksa en yüksek rolüne göre uyarı sayısı verileceği için en yüksek rolünü hesapladık.

    let userUyarıSayısı;
    // => Kişinin sahip olduğu maksimum uyarı sayısı

    if (db_uyarıSayısı.has(user.id)) {
        userUyarıSayısı = db_uyarıSayısı.get(user.id);

        userUyarıSayısı += uyarıSayısı;

        let varsayılanUyarıSayısı = db_varsayılanUyarıSayıları.get(topRole.name);

        if (userUyarıSayısı >= varsayılanUyarıSayısı) {
            // => Uyarı sayısı limitine ulaştı.

            userUyarıSayısı = varsayılanUyarıSayısı;
            // => Fazlalığa gerek yok.

            message.reply("Uyarı silindi. Uyarı limite ulaştı: " + userUyarıSayısı)
        } else {
            message.reply("Uyarı silindi. Güncel sayı: " + userUyarıSayısı)
        }

    } else {
        // => Adam temiz çıktı aga
        return message.reply("Adamın uyarısı yok ki");
    }

    db_uyarıSayısı.set(user.id, userUyarıSayısı);
    // ALTTAKİ KODLAR ÇALIŞMAZ ÜSTTEKİ RETURN YÜZÜNDEN KOPYALA YAPIŞTIR İÇİN ORADA DURUYOR EDİTLERSİN.

    let embed1 = new Discord.MessageEmbed()
        .setTitle(`YETKİLİ UYARI SİSTEMİ`)
        .setDescription(`<@${user.id}> yetkilisinin **` + uyarıSayısı + ` uyarı sayısı** <@${message.author}> tarafından  silindi.`)
        .setColor("000")
        .setTimestamp();

    let yetkiliUyarıCh = message.guild.channels.cache.find("name", "yetkili-uyarı");
    if (yetkiliUyarıCh)
        yetkiliUyarıCh.send(embed1)

};

exports.conf = {
    perms: ["Zeus", "POSEIDON", "Hera", "Hades"],
    // => Yetkisiz komut: @everyone
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
    enabled: true,
    guildOnly: true,
    aliases: ['yus', 'yetkili-uyarı-sil']
};

exports.help = {
    name: 'yetkiliuyarısil',
    description: 'Belirttiğiniz kişinin belirtilen sayı kadar uyarısını siler.',
    usage: 'yetkullanıcı süre sebep'
};