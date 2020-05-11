let Discord = require("discord.js");
let db = require("quick.db");
let moment = require("moment");

module.exports = client => {
    // SÜRELİ KOMUTLAR KONTROL
    console.log(`Süreli ban başlatılıyor.`);
    const guild = client.guilds.cache.get(client.ayarlar.sunucu);
    if (!guild) return console.log("SUNUCU BULUNAMADI");

    // Cezalı kontrol
    let banDb = new db.table("ban");
    setInterval(() => {
        banDb.all().forEach(cezalı => {
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

                console.log(user.displayName + " adlı kişinin ban cezası bitti");
                //**************************************

                guild.members.unban(user, "Ban süresi bitti.")
                    .then(mem => {
                        //**************************************
                        let embed2 = new Discord.MessageEmbed()
                            .setTitle(`🔓 BAN SÜRESİ BİTTİ`)
                            .setDescription(`<@${user.id}> kullanıcısının ban cezası bitti.`)
                            .setColor("000")
                            .setTimestamp();

                        msgCh.send(embed2).then(msg => msg.delete({ timeout: 10000 }));

                        let cezaBilgi = guild.channels.cache.find(e => e.name == "ceza-bilgi");
                        if (cezaBilgi) cezaBilgi.send(embed2);

                        //**************************************

                        banDb.delete(userID);
                    })

            }
        });
    }, 1000);

};
