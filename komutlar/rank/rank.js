const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const Jimp = require('jimp');
const path = require('path');
const text2png = require('text2png');
const sizeOf = require('image-size');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {
    let newMsg;
    await message.channel.send(new Discord.MessageEmbed().setDescription("Hazırlanıyor...")).then(msg => newMsg = msg)

    let guild = message.guild;
    let member = message.member;
    let user = message.author;
    let ppURL = user.displayAvatarURL({ format: "jpg", size: 512 });

    let barPos = { x: 373, y: 160 }
    let barSize = { width: 788, height: 43 }

    let progress = (db.has(`ranks_${guild.id}.ses.${user.id}.expCurrent`) && db.has(`ranks_${guild.id}.ses.${user.id}.expMax`) ? (parseFloat(db.get(`ranks_${guild.id}.ses.${user.id}.expCurrent`)) / parseFloat(db.get(`ranks_${guild.id}.ses.${user.id}.expMax`))) : 0) * barSize.width;
    let sıraInput = db.has(`ranks_${guild.id}.ses.${user.id}.sıra`) ? db.get(`ranks_${guild.id}.ses.${user.id}.sıra`).toString() : "1";
    let levelInput = db.has(`ranks_${guild.id}.ses.${user.id}.level`) ? db.get(`ranks_${guild.id}.ses.${user.id}.level`).toString() : "1";
    let expCurrentInput = db.has(`ranks_${guild.id}.ses.${user.id}.expCurrent`) ? db.get(`ranks_${guild.id}.ses.${user.id}.expCurrent`).toString() : "0";
    let expMaxInput = db.has(`ranks_${guild.id}.ses.${user.id}.expMax`) ? db.get(`ranks_${guild.id}.ses.${user.id}.expMax`).toString() : "788";


    let açıkRenk = "52a786";
    let koyuRenk = "2f7459";
    let açıkBeyaz = "ffffff";
    let koyuBeyaz = "a6a6a6";
    let durumHarf;

    // PP
    console.log(user.presence.status)
    switch (user.presence.status) {
        case "dnd": // kırmızı
            açıkRenk = "880c34";
            koyuRenk = "5e0824";
            durumHarf = "K";
            break;
        case "idle": // sarı
            açıkRenk = "fad21a";
            koyuRenk = "a28918";
            durumHarf = "S";
            break;
        default: // yeşil
            açıkRenk = "52a786";
            koyuRenk = "2f7459";
            durumHarf = "Y";
            break;
    }


    //
    let pp;
    let ppSize = 218;

    var p1 = await Jimp.read(ppURL);
    var p2 = await Jimp.read('https://i.hizliresim.com/2Psnuh.png');

    await Promise.all([p1, p2]).then(function (images) {
        var pic = images[0].resize(ppSize + 1, ppSize);
        var mask = images[1].resize(ppSize + 1, ppSize);
        pp = pic.mask(mask, 0, 0)
    });
    //

    // await new Jimp(512, 512, 'green', (err, image) => { p3 = image; });
    let bgURL = "https://i.hizliresim.com/VflWgM.png";

    var çerçeveK, çerçeveS, çerçeveY;
    await Jimp.read("https://i.hizliresim.com/WMrkJ3.png").then(image => { çerçeveK = image });
    await Jimp.read("https://i.hizliresim.com/w6L86W.png").then(image => { çerçeveS = image });
    await Jimp.read("https://i.hizliresim.com/LXsABV.png").then(image => { çerçeveY = image });

    var durumK, durumS, durumY;
    await Jimp.read("https://i.hizliresim.com/v3di25.png").then(image => { durumK = image })
    await Jimp.read("https://i.hizliresim.com/w2iJXx.png").then(image => { durumS = image })
    await Jimp.read("https://i.hizliresim.com/EjCzax.png").then(image => { durumY = image })

    var barK, barS, barY;
    await Jimp.read("https://i.hizliresim.com/I9egtS.png").then(image => { barK = image })
    await Jimp.read("https://i.hizliresim.com/CBnhXj.png").then(image => { barS = image })
    await Jimp.read("https://i.hizliresim.com/4CRkTt.png").then(image => { barY = image })

    //await Jimp.read(ppURL).then(img => pp = img.resize(222, 222));

    await Jimp.read(bgURL)
        .then(async image => {
            // çerçeve
            await image.composite(eval("çerçeve" + durumHarf), 0, 0);

            // pp            
            await image.composite(eval("durum" + durumHarf), 70, 68); // durum bg
            await image.composite(pp, 70, 68); // pp with circle

            // nick
            let nickImg = await text2png(user.username + " ", {
                font: '41.21pt MS UI Gothic',
                color: "#" + açıkRenk,
                strokeColor: "#" + açıkRenk,
                strokeWidth: 1,
                backgroundColor: 'transparent',
                padding: 0
            });
            var nickSize = await sizeOf(nickImg);
            var nick;
            await Jimp.read(nickImg).then(img => { nick = img })
            await image.composite(nick, barPos.x, 97);

            // tag
            let tagImg = await text2png("#" + user.discriminator, {
                font: '19.98pt MS UI Gothic Regular',
                color: "#" + koyuRenk,
                strokeColor: "#" + koyuRenk,
                strokeWidth: 1,
                backgroundColor: 'transparent',
                padding: 0
            });
            var tagSize = await sizeOf(tagImg);
            var tag;
            await Jimp.read(tagImg).then(img => { tag = img })
            console.log((nickSize.height - tagSize.height))
            await image.composite(tag, barPos.x + nickSize.width, 97 + (24));


            // expMax
            let expMaxImg = await text2png(" / " + expMaxInput + " XP", {
                font: '18pt Arial Regular',
                color: "#" + koyuRenk,
                strokeColor: "#" + koyuRenk,
                backgroundColor: 'transparent',
                padding: 0,
                strokeWidth: 1
            });
            var expMaxSize = await sizeOf(expMaxImg);
            var expMax;
            await Jimp.read(expMaxImg).then(img => { expMax = img })
            await image.composite(expMax, barPos.x + barSize.width - expMaxSize.width, barPos.y + barSize.height + 12);
            // expCurrent
            let expCurrentImg = await text2png(expCurrentInput, {
                font: '18pt Arial Regular',
                color: "#" + açıkRenk,
                strokeColor: "#" + açıkRenk,
                backgroundColor: 'transparent',
                padding: 0,
                strokeWidth: 1
            });
            var expCurrentSize = await sizeOf(expCurrentImg);
            var expCurrent;
            await Jimp.read(expCurrentImg).then(img => { expCurrent = img })
            await image.composite(expCurrent, barPos.x + barSize.width - expMaxSize.width - expCurrentSize.width, barPos.y + barSize.height + 12);


            // sıraLabel
            let sıraLabelImg = await text2png("Sıra ", {
                font: '28.64pt Arial Regular',
                color: "#" + koyuBeyaz,
                strokeColor: "#" + koyuBeyaz,
                strokeWidth: 1,
                backgroundColor: 'transparent',
                padding: 0
            });
            var sıraLabelSize = await sizeOf(sıraLabelImg);
            var sıraLabel;
            await Jimp.read(sıraLabelImg).then(img => { sıraLabel = img })
            // sıraText
            let sıraTextImg = await text2png("#" + sıraInput, {
                font: '38pt Arial Regular',
                color: "#" + açıkBeyaz,
                strokeColor: "#" + açıkBeyaz,
                strokeWidth: 1,
                backgroundColor: 'transparent',
                padding: 0
            });
            var sıraTextSize = await sizeOf(sıraTextImg);
            var sıraText;
            await Jimp.read(sıraTextImg).then(img => { sıraText = img })
            await image.composite(sıraLabel, barPos.x + 12, barPos.y + barSize.height + 14 + (sıraTextSize.height - sıraLabelSize.height));
            await image.composite(sıraText, barPos.x + 12 + sıraLabelSize.width, barPos.y + barSize.height + 14);

            // levelLabel
            let levelLabelImg = await text2png("Level ", {
                font: '28.64pt Arial Regular',
                color: "#" + koyuBeyaz,
                strokeColor: "#" + koyuBeyaz,
                strokeWidth: 1,
                backgroundColor: 'transparent',
                padding: 0
            });
            var levelLabelSize = await sizeOf(levelLabelImg);
            var levelLabel;
            await Jimp.read(levelLabelImg).then(img => { levelLabel = img })
            // levelText
            let levelTextImg = await text2png(levelInput, {
                font: '38pt Arial Regular',
                color: "#" + açıkBeyaz,
                strokeColor: "#" + açıkBeyaz,
                strokeWidth: 1,
                backgroundColor: 'transparent',
                padding: 0
            });
            var levelTextSize = await sizeOf(levelTextImg);
            var levelText;
            await Jimp.read(levelTextImg).then(img => { levelText = img })
            await image.composite(levelLabel, barPos.x + 12 + sıraLabelSize.width + sıraTextSize.width + 38, barPos.y + barSize.height + 14 + (levelTextSize.height - levelLabelSize.height));
            await image.composite(levelText, barPos.x + 12 + sıraLabelSize.width + sıraTextSize.width + 38 + levelLabelSize.width, barPos.y + barSize.height + 14);

            // PROGRESSBAR
            await image.composite(eval("bar" + durumHarf), barPos.x, barPos.y);
            await image.scan(barPos.x, barPos.y, progress, 42, makeIteratorThatFillsWithColor(eval("0x" + açıkRenk + "ff")));

            /*
            // içi boş dikdörtgen
            const fillCrimson = makeIteratorThatFillsWithColor(0xED143DFF);
            image.scan(236, 100, 240, 1, fillCrimson);
            image.scan(236, 100 + 110, 240, 1, fillCrimson);
            image.scan(236, 100, 1, 110, fillCrimson);
            image.scan(236 + 240, 100, 1, 110, fillCrimson);
            */

            await encode(image).then(async result => {
                await newMsg.delete()
                await message.channel.send({
                    files: [result]
                })
            })
        })
        .catch(err => {
            console.error(err)
            message.reply(err.message)
        });

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.kayıtlı
};
exports.help = {
    name: komutAdı,
    description: ``,
    usage: `${komutAdı}`
};

function encode(canvas) {
    return new Promise((fulfill, reject) => {
        canvas.getBuffer(Jimp.MIME_PNG, (err, img) => err ? reject(err) : fulfill(img));
    });
}

function makeIteratorThatFillsWithColor(color) {
    return function (x, y, offset) {
        this.bitmap.data.writeUInt32BE(color, offset, true);
    }
};