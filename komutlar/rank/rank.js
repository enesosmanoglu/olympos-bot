const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const Jimp = require('jimp');
const path = require('path');
const text2png = require('text2png');
const sizeOf = require('image-size');
const shortNumber = require('short-number');
const moment = require("moment");
moment.locale("tr");

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message = new Discord.Message(), args) => {
    if (message.channel.name != "komutlar" && !ayarlar.sahipIDs.some(id => id == message.author.id)) {
        let komutlarCh = message.guild.channels.cache.find(c => c.name == "komutlar");
        if (komutlarCh)
            return message.reply(`Lütfen bu komutu ${komutlarCh} kanalında kullanınız!`)
    }

    let newMsg;
    await message.channel.send(new Discord.MessageEmbed().setDescription(`<@${message.author.id}>, rank resmini birkaç saniye içinde hazırlıyorum...`)).then(msg => newMsg = msg)

    let guild = message.guild;
    let member = message.member;
    let user = message.author;

    if (message.mentions.members.size != 0 && ayarlar.sahipIDs.some(id => id == message.author.id)) {
        member = message.mentions.members.first()
        user = member.user
    }

    let ppURL = user.displayAvatarURL({ format: "jpg", size: 512 });

    let barPoss = [{ x: 159, y: 324 }, { x: 159, y: 424 }, { x: 159, y: 524 }]
    let barSize = { width: 966, height: 56 }
    console.log(`${user.tag} için rank bilgileri çekiliyor.`)
    //sıralama

    function calcExpMax(level, kategori) {
        let maxExp = 0;
        for (i = 1; i <= level; i++) {
            maxExp += ayarlar.ranks[kategori].varsayılan.expMax * Math.pow(2, parseInt((i - 1) / 5))
        }
        return (maxExp)
    }

    let kategoriler = ["ses", "mesaj", "oyun"]

    let rank = {}

    let ay = moment().utcOffset(3).format('YYYYMM')

    kategoriler.forEach(kategori => {
        if (!rank[kategori]) rank[kategori] = {}

        // if (kategori == "ses") {
        //     let yedek = db.get(`rankyedek_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori)
        //     let asd = db.get(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori)
        //     let asdd = db.get(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori + ".208196116078919680.expCurrent")
        //     console.log(asd)
        //     console.log(asdd)
        //     //console.log(yedek)

        //     //console.log(db.set(`rankyedek_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori, asd))
        // }


        let topList = db.has(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori) ? Object.values(db.get(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori)).sort((a, b) => b.expCurrent - a.expCurrent) : []
        let expCurrentDbPath = `ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori + `.${user.id}.expCurrent`
        let expMaxDbPath = `ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori + `.${user.id}.expMax`
        let exExpMax = db.has(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori + `.${user.id}.level`) ? calcExpMax(db.get(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori + `.${user.id}.level`) - 1 - 1, kategori) : 0
        rank[kategori].progress = (db.has(expCurrentDbPath) && db.has(expMaxDbPath) ? (parseFloat(db.get(expCurrentDbPath)) - parseFloat(exExpMax)) / (parseFloat(db.get(expMaxDbPath)) - parseFloat(exExpMax)) : 0) * barSize.width;
        rank[kategori].sıraInput = db.has(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori + ``) ? ((topList.indexOf(topList.find(a => a.id == user.id)) + 1) == 0 ? topList.length + 1 : (topList.indexOf(topList.find(a => a.id == user.id)) + 1)).toString() : "0";
        rank[kategori].levelInput = db.has(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori + `.${user.id}.level`) ? db.get(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori + `.${user.id}.level`).toString() : "1";
        rank[kategori].expCurrentInput = db.has(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori + `.${user.id}.expCurrent`) ? shortNumber(parseInt(db.get(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori + `.${user.id}.expCurrent`))).toString() : "0";
        rank[kategori].expMaxInput = db.has(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori + `.${user.id}.expMax`) ? shortNumber(parseInt(db.get(`ranks_${guild.id}.aylık.${moment().utcOffset(3).format('YYYYMM')}.` + kategori + `.${user.id}.expMax`))).toString() : "1";
    });

    console.log(`${user.tag} için rank bilgileri çekildi.`)

    let açıkRenk = "52a786";
    let koyuRenk = "2f7459";
    let açıkBeyaz = "ffffff";
    let koyuBeyaz = "ffffff"//"a6a6a6";
    let durumHarf;

    // PP
    //console.log(user.presence.status)
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

    console.log(`${user.tag} için rank resmi için assets hazırlanıyor.`)
    //
    let pp;
    let ppSize = 218;

    var p1 = await Jimp.read(ppURL);
    var p2 = await Jimp.read("/app/assets/mask.png");

    await Promise.all([p1, p2]).then(function (images) {
        var pic = images[0].resize(ppSize + 1, ppSize);
        var mask = images[1].resize(ppSize + 1, ppSize);
        pp = pic.mask(mask, 0, 0)
    });
    //

    // await new Jimp(512, 512, 'green', (err, image) => { p3 = image; });
    let bgURL = "/app/assets/arkaplan.png";

    var rankResim = []
    await Jimp.read("/app/assets/ses.png").then(image => { rankResim.push(image) });
    await Jimp.read("/app/assets/mesaj.png").then(image => { rankResim.push(image) });
    await Jimp.read("/app/assets/oyun.png").then(image => { rankResim.push(image) });

    var çerçeveK, çerçeveS, çerçeveY;
    await Jimp.read("/app/assets/çerçeveK.png").then(image => { çerçeveK = image });
    await Jimp.read("/app/assets/çerçeveS.png").then(image => { çerçeveS = image });
    await Jimp.read("/app/assets/çerçeveY.png").then(image => { çerçeveY = image });

    var durumK, durumS, durumY;
    await Jimp.read("/app/assets/durumK.png").then(image => { durumK = image })
    await Jimp.read("/app/assets/durumS.png").then(image => { durumS = image })
    await Jimp.read("/app/assets/durumY.png").then(image => { durumY = image })

    var barK, barS, barY;
    await Jimp.read("/app/assets/barK.png").then(image => { barK = image })
    await Jimp.read("/app/assets/barS.png").then(image => { barS = image })
    await Jimp.read("/app/assets/barY.png").then(image => { barY = image })

    //await Jimp.read(ppURL).then(img => pp = img.resize(222, 222));

    await Jimp.read(bgURL)
        .then(async image => {
            console.log(`${user.tag} için rank resmi hazırlanıyor.`)
            // çerçeve
            await image.composite(eval("çerçeve" + durumHarf), 0, 0);

            // pp            
            await image.composite(eval("durum" + durumHarf), 73, 54); // durum bg
            await image.composite(pp, 73, 54); // pp with circle

            // nick
            let nickImg = await text2png(user.username + " ", {
                font: '41.21pt monofur',
                color: "#" + açıkBeyaz,
                strokeColor: "#" + açıkBeyaz,
                strokeWidth: 1,
                backgroundColor: 'transparent',
                padding: 0
            });
            var nickSize = await sizeOf(nickImg);
            var nick;
            await Jimp.read(nickImg).then(img => { nick = img })
            await image.composite(nick, 342, 142);

            // tag
            let tagImg = await text2png("#" + user.discriminator, {
                font: '19.98pt Ubuntu Mono',
                color: "#" + koyuBeyaz,
                strokeColor: "#" + koyuBeyaz,
                strokeWidth: 1,
                backgroundColor: 'transparent',
                padding: 0
            });
            var tagSize = await sizeOf(tagImg);
            var tag;
            await Jimp.read(tagImg).then(img => { tag = img })
            //console.log((nickSize.height - tagSize.height))
            await image.composite(tag, 342 + nickSize.width, 142 + (24));

            let barCount = 0;
            barPoss.forEach(async barPos => {
                let kategori = kategoriler[barPoss.indexOf(barPos)]
                let { progress, sıraInput, levelInput, expCurrentInput, expMaxInput } = rank[kategori]

                // PROGRESSBAR
                await image.composite(eval("bar" + durumHarf), barPos.x, barPos.y);
                await image.scan(barPos.x, barPos.y, progress, barSize.height, makeIteratorThatFillsWithColor(eval("0x" + açıkRenk + "ff")));

                // 80 330
                let ind = barPoss.indexOf(barPos);
                let iconHeight = [330, 429, 532]
                let icon = rankResim[ind]
                await image.composite(icon, 80, iconHeight[ind]);

                // expMax
                let expMaxImg = await text2png(" / " + expMaxInput + " XP", {
                    font: '18pt Ubuntu Mono',
                    color: "#" + koyuBeyaz,
                    strokeColor: "#" + koyuBeyaz,
                    backgroundColor: 'transparent',
                    padding: 0,
                    strokeWidth: 4
                });
                var expMaxSize = await sizeOf(expMaxImg);
                var expMax;
                await Jimp.read(expMaxImg).then(img => { expMax = img })
                await image.composite(expMax, barPos.x + barSize.width - expMaxSize.width - 17, barPos.y + 18);
                // expCurrent
                let expCurrentImg = await text2png(expCurrentInput, {
                    font: '18pt Ubuntu Mono',
                    color: "#" + açıkBeyaz,
                    strokeColor: "#" + açıkBeyaz,
                    backgroundColor: 'transparent',
                    padding: 0,
                    strokeWidth: 4
                });
                var expCurrentSize = await sizeOf(expCurrentImg);
                var expCurrent;
                await Jimp.read(expCurrentImg).then(img => { expCurrent = img })
                await image.composite(expCurrent, barPos.x + barSize.width - expMaxSize.width - 17 - expCurrentSize.width, barPos.y + 18);

                // sıraLabel
                let sıraLabelImg = await text2png("Sıra ", {
                    font: '25pt Ubuntu Mono',
                    color: "#" + koyuBeyaz,
                    strokeColor: "#" + koyuBeyaz,
                    strokeWidth: 14,
                    backgroundColor: 'transparent',
                    padding: 0
                });
                var sıraLabelSize = await sizeOf(sıraLabelImg);
                var sıraLabel;
                await Jimp.read(sıraLabelImg).then(img => { sıraLabel = img })
                // sıraText
                let sıraTextImg = await text2png("#" + sıraInput, {
                    font: '32pt Ubuntu Mono',
                    color: "#" + açıkBeyaz,
                    strokeColor: "#" + açıkBeyaz,
                    strokeWidth: 14,
                    backgroundColor: 'transparent',
                    padding: 0
                });
                var sıraTextSize = await sizeOf(sıraTextImg);
                var sıraText;
                await Jimp.read(sıraTextImg).then(img => { sıraText = img })
                await image.composite(sıraLabel, barPos.x + 20, barPos.y + 14 + (sıraTextSize.height - sıraLabelSize.height));
                await image.composite(sıraText, barPos.x + 20 + sıraLabelSize.width, barPos.y + 14);

                // levelLabel
                let levelLabelImg = await text2png("Level ", {
                    font: '25pt Ubuntu Mono',
                    color: "#" + koyuBeyaz,
                    strokeColor: "#" + koyuBeyaz,
                    strokeWidth: 14,
                    backgroundColor: 'transparent',
                    padding: 0
                });
                var levelLabelSize = await sizeOf(levelLabelImg);
                var levelLabel;
                await Jimp.read(levelLabelImg).then(img => { levelLabel = img })
                // levelText
                let levelTextImg = await text2png(levelInput, {
                    font: '32pt Ubuntu Mono',
                    color: "#" + açıkBeyaz,
                    strokeColor: "#" + açıkBeyaz,
                    strokeWidth: 14,
                    backgroundColor: 'transparent',
                    padding: 0
                });
                var levelTextSize = await sizeOf(levelTextImg);
                var levelText;
                await Jimp.read(levelTextImg).then(img => { levelText = img })
                await image.composite(levelLabel, barPos.x + 20 + sıraLabelSize.width + sıraTextSize.width + 38, barPos.y + 14 + (levelTextSize.height - levelLabelSize.height));
                await image.composite(levelText, barPos.x + 20 + sıraLabelSize.width + sıraTextSize.width + 38 + levelLabelSize.width, barPos.y + 14);

                barCount += 1;
            });

            // www.olymposweb.com
            let webSiteImg = await text2png("www.olymposweb.com", {
                font: '25pt Ubuntu Mono',
                color: "#ffffff70",
                strokeColor: "#ffffff70",
                backgroundColor: 'transparent',
                padding: 0,
                strokeWidth: 2
            });
            var webSiteSize = await sizeOf(webSiteImg);
            var webSite;
            await Jimp.read(webSiteImg).then(img => { webSite = img })
            await image.composite(webSite, 462, 648);

            /*
            // içi boş dikdörtgen
            const fillCrimson = makeIteratorThatFillsWithColor(0xED143DFF);
            image.scan(236, 100, 240, 1, fillCrimson);
            image.scan(236, 100 + 110, 240, 1, fillCrimson);
            image.scan(236, 100, 1, 110, fillCrimson);
            image.scan(236 + 240, 100, 1, 110, fillCrimson);
            */

            let interval = setInterval(async () => {
                if (barCount >= barPoss.length) {
                    clearInterval(interval);
                    await encode(image).then(async result => {
                        console.log(`${user.tag} için rank resmi hazır.`)
                        await newMsg.delete()
                        await message.channel.send({
                            files: [result]
                        })
                    })
                }
            }, 100);


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
    perms: ayarlar.perms.herkes
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