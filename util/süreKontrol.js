let Discord = require("discord.js");
let db = require("quick.db");
let moment = require("moment");

module.exports = client => {
    // SÜRELİ KOMUTLAR KONTROL
    console.log(`Süreli komutlar başlatılıyor.`);
    const guild = client.guilds.cache.get(client.ayarlar.sunucu);
    if (!guild) return console.log("SUNUCU BULUNAMADI");

    // Cezalı kontrol
    let muteDb = new db.table("mute");
    setInterval(() => {
        muteDb.all().forEach(cezalı => {
            let userID = cezalı.ID;
            let msgChID = cezalı.data.msgChID;
            let cezaBitiş = cezalı.data.cezaBitiş;
            let cezaVerenID = cezalı.data.cezaVerenID;

            let şuan = parseInt(moment().format("x"));

            if (şuan >= cezaBitiş) {
                // Cezası bitmiş
                let user = guild.members.cache.find(e => e.id == userID);
                let msgCh = guild.channels.cache.find(e => e.id == msgChID);
                let cezaVeren = guild.members.cache.find(e => e.id == cezaVerenID);
                if (!cezaVeren) return;
                if (!msgCh) msgCh = cezaVeren.user.dmChannel;

                if (!user) return;

                console.log(user.displayName + " adlı kişinin mute cezası bitti");

                //**************************************
                guild.channels.cache.forEach(channel => {
                    //channel.overwritePermissions(user, { SEND_MESSAGES: null });
                    if (!channel.permissionOverwrites.get(userID)) return;
                    channel.permissionOverwrites.get(userID).delete()
                });

                user.setNickname(user.displayName.replace("[MUTED]", ""))

                let embed2 = new Discord.MessageEmbed()
                    .setTitle(`🔓 CHAT MUTE SÜRESİ BİTTİ`)
                    .setDescription(`<@${user.id}> kullanıcısının susturulma cezası bitti.`)
                    .setColor("000")
                    .setTimestamp();

                msgCh.send(embed2)//.then(msg => msg.delete({ timeout: 10000 }));

                let cezaBilgi = guild.channels.cache.find(e => e.name == "ceza-bilgi");
                if (cezaBilgi) cezaBilgi.send(embed2);

                //**************************************

                muteDb.delete(userID);
            }
        });
    }, 1000);

    // sesmute kontrol
    let sesmuteDb = new db.table("sesmute");

    let cezalılar = {};

    setInterval(() => {
        sesmuteDb.all().forEach(cezalı => {
            let userID = cezalı.ID;
            let msgChID = cezalı.data.msgChID;
            let cezaBitiş = cezalı.data.cezaBitis;
            if (!cezaBitiş) {
                console.error("db sikildi")
                return sesmuteDb.delete(userID)
            }


            let şuan = parseInt(moment().format("x"));

            if (!cezalılar[userID]) {
                console.log("sesmute kullanıcı kayıt");
                cezalılar[userID] = {
                    user: guild.members.cache.get(userID),
                    msgCh: guild.channels.cache.get(msgChID)
                };
            }
            if (cezalılar[userID].msgCh.id != msgChID) {
                console.log("sesmute kullanıcı kanal güncelleme");
                cezalılar[userID].msgCh = guild.channels.cache.get(msgChID);
            }

            if (!cezalılar[userID].user) return sesmuteDb.delete(userID);
            if (!cezalılar[userID].user.voice.channel) return;


            if (şuan >= cezaBitiş) {
                // Cezası bitmiş
                //console.log("bitiş")

                //**************************************

                if (!sesmuteDb.has(userID + ".msgID")) {
                    let embed2 = new Discord.MessageEmbed()
                        .setTitle(`🔓 SES MUTE SÜRESİ BİTTİ`)
                        .setDescription(
                            `<@${cezalılar[userID].user.id}> kullanıcısının susturulma cezası bitti.`
                        )
                        .setColor("000")
                        .setTimestamp();

                    cezalılar[userID].msgCh
                        .send(embed2)
                        .then(msg => {
                            sesmuteDb.set(userID + ".cezaBitis", cezaBitiş)
                            sesmuteDb.set(userID + ".msgChID", msgChID);
                            sesmuteDb.set(userID + ".msgID", msg.id)
                            //msg.delete({ timeout: 10000 })
                        });

                    let cezaBilgi = guild.channels.cache.find(e => e.name == "ceza-bilgi");
                    if (cezaBilgi) cezaBilgi.send(embed2);
                }

                let tooRooms = guild.channels.cache.filter(c => c.name.includes("Town of Olympos"))
                tooRooms.forEach(async tooRoom => {
                    if (tooRoom.permissionOverwrites.get(userID))
                        tooRoom.permissionOverwrites.get(userID).delete()
                });

                cezalılar[userID].user.voice.setMute(false).catch(err => { })

                //if (!cezalılar[userID].user.voice.channel) return;

                if (cezalılar[userID].user.voice.serverMute) return;



                //**************************************

                sesmuteDb.delete(userID);



            } else {
                cezalılar[userID].user.voice.setMute(true).catch(err => { });
            }
        });
    }, 1000);

    // Cezalı kontrol
    let cezaDb = new db.table("ceza");
    setInterval(() => {
        cezaDb.all().forEach(cezalı => {
            let userID = cezalı.ID;
            let msgChID = cezalı.data.msgChID;
            let cezaBitiş = cezalı.data.cezaBitiş;
            let rollerNames = cezalı.data.roller ? cezalı.data.roller : ["@everyone"];

            let şuan = parseInt(moment().format("x"));

            if (şuan >= cezaBitiş) {
                // Cezası bitmiş
                let user = guild.members.cache.find(e => e.id == userID);
                let msgCh = guild.channels.cache.find(e => e.id == msgChID);

                let roller = [];
                rollerNames.forEach(rolName => {
                    let rol = guild.roles.cache.find(e => e.name == rolName);
                    if (!rol) return console.log("Eski rol bulunamadı: " + rolName);
                    roller.push(rol);
                });

                if (!user) return cezaDb.delete(userID);

                user.roles.set(roller, "Ceza bitti.");

                let embed2 = new Discord.MessageEmbed()
                    .setTitle(`🔓 CEZA SÜRESİ BİTTİ`)
                    .setDescription(`<@${user.id}> kullanıcısının cezası bitti.`)
                    .setColor("000")
                    .setTimestamp();

                msgCh.send(embed2)//.then(msg => msg.delete({ timeout: 10000 }));

                let cezaBilgi = guild.channels.cache.find(e => e.name == "ceza-bilgi");
                if (cezaBilgi) cezaBilgi.send(embed2);

                cezaDb.delete(userID);
            }
        });
    }, 1000);
};
