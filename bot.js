const moment = require("moment");
moment.locale("tr");

var originalConsoleLog = console.log;
console.log = function () {
    args = [];
    args.push('[' + moment().utcOffset(3).format("lll") + ']');
    for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    originalConsoleLog.apply(console, args);
};

 
console.log(" \n \n \n \n \n \n \n \n \n")
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
console.log(process.env.PROJECT_DOMAIN + " başlatılıyor. Lütfen bekleyiniz...")
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

const http = require("http")
const express = require("express");
const app = express();
app.get("/", (request, response) => {
    console.log(`¨`);
    response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 10000); 
const terminal = require('node-cmd');
app.get('/clear-git', (req, res) => {
	terminal.run('chmod 777 git.sh'); /* Fix no perms after updating */
	terminal.get('./git.sh', (err, data) => {  // Run the script
		if (data) console.log(data);
		if (err) console.log(err);
	});
	//terminal.run('refresh');  // Refresh project
	console.log('Git files cleared!');
	return res.status(200); // Send back OK status
});
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/clear-git`);
}, 120000); 

//////////////////////////////////////////////////////////////////////



/* Modüller */
const Discord = require("discord.js");
const client = new Discord.Client();
const chalk = require("chalk");
const fs = require("fs");
const db = require("quick.db");
const backup = require("discord-backup");
backup.setStorageFolder("./backups/");


client.on("ready", () => {
  console.log("sa")
    require("./util/backup")(client);
})

client.ayarlar = require("./ayarlar");

require("./util/eventLoader")(client);

const log = message => {
    console.log(`[${moment().utcOffset(3).format("lll")}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

let komutlar = []
let getCommands = function (path) {
    fs.readdir(path, (err, files) => {
        if (err) console.error(err);
        files.forEach(f => {
            if (!f.endsWith(".js")) {
                // klasör ya da komut değil

                if (fs.lstatSync(path + f + "/").isDirectory()) {
                    // iç içe fonksiyonla tüm alt klasörlerdeki komutları tarıyoruz.
                    getCommands(path + f + "/")
                }

            } else {
                //console.log(path + f) // Her komutun yolunu ayrı ayrı loglar
                //komut.js
                let props = require(`${path}${f}`);
                komutlar.push(props.help.name)
                client.commands.set(props.help.name, props);
                props.conf.aliases.forEach(alias => {
                    client.aliases.set(alias, props.help.name);
                });
            }
        });
    });
}

getCommands("./komutlar/")

client.on("error", (e) => client.destroy());
client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let komutlar = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, komutlar);
            komutlar.conf.aliases.forEach(alias => {
                client.aliases.set(alias, komutlar.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
client.randomMesajlar = new Discord.Collection();
getRandomMessages()
function getRandomMessages() {
    let randomMesajlarPath = '/app/randomMesajlar/';
    fs.readdir(randomMesajlarPath, (err, files) => {
        if (err) console.error(err);
        files.forEach(fileName => {
            if (fileName.endsWith(".txt")) {
                let mesajlar = fs.readFileSync(randomMesajlarPath + fileName, 'UTF-8').split("☻")
                client.randomMesajlar.set(fileName.replace(".txt", ""), mesajlar);
            }
        });
    });
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomMessage(komut) {
    const mesajlar = client.randomMesajlar.get(komut);
    return mesajlar[getRandomInt(0, mesajlar.length - 1)]
}
client.replaceEmojis = function (text) {
    let sp = text.split(":");
    let emojis = {}
    sp.forEach(str => {
        let emoji = client.emojis.cache.find(e => e.name == str)
        if (emoji)
            emojis[str] = emoji
    });
    Object.keys(emojis).forEach(str => {
        let emoji = emojis[str];
        text = text.replace(eval(`/:${str}:/g`), emoji)
    });
    return text;
}

client.on("message", msg => {
    if (!msg.author) return;
    if (msg.author.bot) return; // BOT SPAM KORUMA

    if (msg.channel.name == "doğum-günü") {
        return;
    }

    function sendImage(url) {
        msg.channel.send(new Discord.MessageEmbed().setImage(url).setColor("2f3136"))
    }
    function sendMessage(text, reply = false) {
        if (reply)
            msg.reply(new Discord.MessageEmbed().setDescription(text).setColor("2f3136"))
        else
            msg.channel.send(new Discord.MessageEmbed().setDescription(text).setColor("2f3136"))
    }
    function sendMsg(text, reply = false) {
        if (reply)
            msg.reply(text)
        else
            msg.channel.send(text)
    }


    if (client.randomMesajlar.has(msg.content.toLowerCase()))
        return sendMessage(client.replaceEmojis(randomMessage(msg.content.toLowerCase()).replace(/<@user>/g, `<@${msg.author.id}>`)));

    switch (msg.content.toLowerCase()) {
        case client.ayarlar.prefix + "ranks":
            sendMessage("Aylık yerine toplam sıralamayı görmek için: https://www.olymposweb.com/rank");
            break;
        case client.ayarlar.prefix + "toplamrank":
            sendMessage("Aylık yerine toplam sıralamayı görmek için: https://www.olymposweb.com/rank");
            break;
        case client.ayarlar.prefix + "sıralama":
            sendMessage("Aylık yerine toplam sıralamayı görmek için: https://www.olymposweb.com/rank");
            break;
        case "tag":
            sendMsg("✧");
            break;
        case "!tag":
            sendMsg("✧");
            break;
        case "sea":
            sendMessage("ase");
            break;
        case "selamun aleyküm":
            sendMessage("as");
            break;
        case "selamın aleyküm":
            sendMessage("as");
            break;
        case "selam":
            sendMessage("selammm ヾ(●ε●)ノ");
            break;
        case "s3x":
            sendMessage("s3x in the küvet");
            break;
        case "günaydın":
            sendMessage("Günün güzel geçsin ヾ(＾∇＾)", true);
            break;
        case "olympos nedir":
            sendMessage("En yüksek dağ olan Olimpos dağı, Yunan mitolojisinde tanrıların oturduğu dağdır. Tanrıların kralı Zeus’un meskeni olan Olimpos, Zeus dışında, Yunan mitolojisinin 12 büyük tanrısının evidir. Bazı kaynaklarda Olympus, bazı kaynaklarda Olympos olarak geçer.");
            break;
        case "olympos":
            sendMessage("Ne var be! Ayy, pardon. ●﹏●");
            break;
        case "olympus":
            sendMessage("Bana Olympos der misin artık? ( ͡° ʖ̯ ͡°)");
            break;
        case "olympus mu olympos mu":
            sendMessage("Herkesin kafasında aynı soru: Olympus mu, yoksa Olympos mu? Ben bile unuttum kendi adımı... Ama Olympos daha güzel. O yüzden Olympos ≧❀‿❀≦");
            break;
        case "zeus kimdir":
            sendMessage("Yunan mitolojisinin en büyük ve en güçlü ama bir o kadar tuhaf tanrısı Zeus: ‘Tanrıların ve İnsanların Babası’ olarak bilinir. Romalılar ona Jüpiter demektedir. Karısı baş tanrıça Hera’dır. İkisinin karakterini biraz detaylı incelediğinizde tanrısal özelliklerinden çok insani özellikleri ön plana çıkar. Şimşeklerin ve gök gürültüsünün tanrısıdır. Her tanrı gibi caydırıcı ve hükmedici bir gücü vardır. Ondan korkmak için sadece kafanızı kaldırıp gökyüzüne bakmanız, gördüğünüz şeyin kudreti ve bilinmezliği karşısında ezilmeniz gerekir. Dünyaya dair çok az şey bilen insanoğlu denizlerden, gökyüzünden ve doğal afetlerden fazlasıyla etkilenerek bu tanrıları uydurmuşlardır. https://gph.is/g/4wvWq8Z");
            break;
        case "kurucu kim":
            sendMessage("jamie", true);
            break;
        case "poseidon kimdir":
            sendMessage("Merhaba bugün konumuz Denizlerin Tanrısı, toprakların hakimi, yeryüzünü titreten, üç dişli yabanın sahibi Poseidon… Yunan Tanrıları arasında Denizi simgeler ve Zeus’un da kardeşidir. Roma mitolojisinde adı Neptün’dür. Annesi Rhea babası ise Kronos’dur. Güçlüydü ve Zeus’dan sonra en önemli tanrıydı. Elinde sembolü olan üç dişli yabası ile denizleri ve toprakları kontrol ederdi. Bu üç dişli yabayı yere vurduğunda ise adaları denize gömer, bazı adaları denizin üzerine çıkararak depremler yaratırdı. Gücünün her zaman farkındaydı ve Zeus’a kafa tutma fırsatlarını da hiç bir zaman kaçırmadı. Destanlara bakıldığında, Zeus’un ona emir vermesinden hoşlanmadığı çok bellidir. Bu hoşnutsuzluk Poseidon’u kimi zaman kardeşleriyle yani diğer tanrı ve tanrıçalarla birleşerek Zeus’u zincirlemeye kadar gitmiştir. http://gph.is/1nYKp3N", false);
            break;
        case "hera kimdir":
            sendMessage("Yunan Tanrıçalarının Kraliçesi Hera… Zeus Yunan mitolojisinde bir çok kadın ile birlikte olmuştur. Neredeyse bu konuda durdurulamayan Zeus’un tek ve sürekli eşi olarak bilinir Hera. Ancak şöyle bir durum var, Zeus’un sadece karısı değil aynı zamanda kız kardeşidir. Öyle üvey falan değil, baya ikisinin de babası Kronos annesi Rhea’dır. Bu özelliğiyle diğer tüm Olympos’lu tanrıların da kız kardeşi oluyor. Zeus, babası Kronos ile savaşıp onu yendikten ve kardeşlerini Kronos’dan kurtarıp egemenliğini ilan eder ve Hera’yı da kendisine eş olarak seçer.", false);
            break;
        case "athena kimdir":
            sendMessage("Yunan mitolojisinde akıl, sanat, strateji, barış ve savaşın tanrıçası. Roma mitolojisinde Minerva diye anılır. Babası Tanrıların başı Zeus, annesi ise Zeus’un ilk karısı olan Hikmet Tanrıçası Metis’tir. Sembolleri: Kalkan, mızrak, zeytin dalı ve baykuştur. Athena, Atina kentinin baş Tanrısı ve koruyucusudur, kent ismini de ondan almıştır. Athena ve sembolize ettiği karekterler bir çok farklı kültürde fazlasıyla benzer formlarda bulunmaktadır.", false);
            break;
        case "ares kimdir":
            sendMessage("Savaş tanrısı Ares’in Roma’daki karşılığı Mars’tır. Zeus ile Hera’nın birleşmesi sonucu doğan Ares, sürekli savaş başlatıp insanların ölümünden, şehirlerin istila edilmesinden zevk aldığı için çoğu tanrı tarafından sevilmez. Ares, Yunan mitolojisinde şiddeti tahrik eden tutkulu ve hırçın bir aşık ve vicdansız bir arkadaş olarak tasvir edilmesine karşın Romalıların tanrısı Mars’ta bu kötü huylarının hiçbirine rastlanmaz. Homeros’un destanlarında da kaba kuvveti simgeleyen Ares; azgın, uğursuz, çılgın olarak da nitelendirilir.", false);
            break;
        case "hermes kimdir":
            sendMessage("Zeus ile Maia’nın oğlu olan Hermes, tanrıların en kurnazı ve hızlısı olarak bilinmektedir. Bu kurnaz tanrının Roma mitolojisindeki karşılığı Merkür’dür. 7 telli liri ve kavalı icat eden Hermes, Zeus’un habercisi olarak görev yapar. Ticaret yapanlara kılavuzluk etmek ve dünyanın neresinde olursa olsun yolcuların özgür hakkını korumak gibi görevleri de vardır. Önemli görevlerinden biri de ölenleri ruhlarını yer altı ülkesine götürmektir.", false);
            break;
        case "dionysos kimdir":
            sendMessage(`Yunan mitolojisinde şarap, bereket ve bitki tanrısı. Zeus ile Semele’nin oğludur. Semele, gebe kaldığı Zeus’u görmek ister, ancak yıldırım tanrısı biçiminde gözüken Zeus, Semele’nin ölümüne yol açar. Karnındaki yedi aylık çocuğu da Zeus alıp baldırına koyar ve ikinci bir doğumla meydana çıkarır. Bir adı da Bakkhos olan tanrının simgesi çam ve kutsal sunaklardaki simgesel sütunlara dolanan sarmaşıktır. Dionisos üzüm, incir ekimini de yönetirdi. Kimi özellikleri onu su ile birleştirir. Aynı zamanda bir üreme tanrısı olarak da bilinir. Dionisos onuruna düzenlenen "Dionisos Şenlikleri"nden Yunan tiyatrosu ve "Dithirambos" denilen, Dionisos ile başka tanrıları ve kahramanları konu alan kült şarkıları doğmuştur.`, false);
            break;
        case "apollon kimdir":
            sendMessage("Apollon, mitolojide müziğin, sanatların, güneşin, ateşin ve şiirin tanrısı, kehanet yapan, bilici tanrıdır. Aynı zamanda kahinlik yeteneğini diğer insanlara da transfer edebilir.", false);
            break;
        case "artemis kimdir":
            sendMessage("Yunan mitolojisinde av tanrıçası. Apollon’un ikiz kız kardeşi, Zeus ve Leto’nun kızıdır. Genellikle ok, yay ve bir meşale taşır. Roma mitolojisindeki tanrıça Diana, erken çağlardan beri Artemis ile bir tutulmuştur.", false);
            break;
        case "buranın kurucusu kim":
            sendMessage("jamie", true);
            break;
        case "taç sahibi kim":
            sendMessage("jamie", true);
            break;
        case "şikayet":
            sendMessage("Şikayet mi dedi birisi? (ง •̀ω•́)ง✧ Bir şikayetin varsa #destek-şikayet kanalını kullanabilir, yetkilileri etiketleyebilirsin. Şikayet edeceğin kişi yetkiliyse, üst yönetimden birilerini etiketleyebilirsin.", true);
            break;
        case "olympos kalk":
            sendMessage("Ya bi sal beni sal (¦ꎌ[▓▓]", false);
            break;
        case "atatürk":
            let rnd = getRandomInt(0, client.ayarlar.atatürk.length - 1)
            console.log(rnd)
            sendImage(client.ayarlar.atatürk[rnd]);
            break;
        case "o7":
            let rnd2 = getRandomInt(0, client.ayarlar.atatürk.length - 1)
            console.log(rnd2)
            sendImage(client.ayarlar.atatürk[rnd2]);
            break;
        case "web":
            sendMessage("**https://www.olymposweb.com**", false);
            break;
        case "web site":
            sendMessage("**https://www.olymposweb.com**", false);
            break;
        case client.ayarlar.prefix + "zeus instagram":
            sendMessage("Bu çocuğun da hiç zeusa benzer bi hali yok ama neys... https://www.instagram.com/hasankozogluu (ノ^o^)ノ", true);
            break;
        case client.ayarlar.prefix + "zeus insta":
            sendMessage("Bu çocuğun da hiç zeusa benzer bi hali yok ama neys... https://www.instagram.com/hasankozogluu (ノ^o^)ノ", true);
            break;
        case client.ayarlar.prefix + "web":
            sendMessage("**https://www.olymposweb.com** ☜(^o^☜） ", false);
            break;
        case client.ayarlar.prefix + "web site":
            sendMessage("**https://www.olymposweb.com** ☜(^o^☜） ", false);
            break;

        default:
            break;
    }

    if (!msg.content.startsWith(client.ayarlar.prefix)) {
        return;
    }
});

////////////////////////////// oynuyor yazısı
const activities_list = [
    "www.olymposweb.com",
    "www.olymposweb.net",
    "ria",
    "jamie",
];

client.on("ready", () => {
    setInterval(() => {
        const index = getRandomInt(0, activities_list.length - 1)
        client.user.setPresence({ activity: { name: activities_list[index], type: 'WATCHING' } });
        //client.user.setActivity(`this won't appear in the bot's custom status!`, {type: null})
    }, 5000);
});

client.on("error", e => {
    console.log("Hata oluştu!");
});

client.on("disconnect", e => {
    console.log("Botun bağlantısı kaybedildi!");
});

client.on("debug",a => {
  console.log(a)
})

///////KURULUM KISMI SON//////////
client.login(process.env.TOKEN);
