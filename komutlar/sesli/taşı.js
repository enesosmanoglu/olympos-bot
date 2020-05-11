const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {

    message.delete();

    if (args.length < 2)
        return message.reply("Lütfen, iki farklı odanın id'sini giriniz.")

    let odaID1 = args[0]
    let odaID2 = args[1]

    if (odaID1 == odaID2)
        return message.reply("Lütfen, iki farklı odanın id'sini giriniz.")

    let oda1 = message.guild.channels.cache.find(c => c.id == odaID1 && c.type == "voice");
    let oda2 = message.guild.channels.cache.find(c => c.id == odaID2 && c.type == "voice");

    if (!oda1)
        return message.reply(odaID1 + " id'ye sahip sesli oda bulamadım.")
    if (!oda2)
        return message.reply(odaID2 + " id'ye sahip sesli oda bulamadım.")

    let başarılı = []
    let başarısız = {}
    const count = oda1.members.size
    oda1.members.forEach(async member => {
        member.voice.setChannel(oda2)
            .then(mem => {
                başarılı.push(mem.user.id)
            })
            .catch(err => {
                başarısız[mem.user.id] = err.message;
            })
    });

    let interval = setInterval(() => {
        if (başarılı.length + Object.keys(başarısız).length >= count) {
            clearInterval(interval);
            let embed = new Discord.MessageEmbed()
                .setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(`${oda1.name} > ${oda2.name}`)
                .setDescription(`
                **${başarılı.length}** kişi başarıyla taşındı.
                **${Object.keys(başarısız).length}** kişi taşınamadı.
                `)
            if (Object.keys(başarısız).length > 0) {
                let desc = []
                Object.keys(başarısız).forEach(userID => {
                    desc.push(`<@${userID}>: \`${başarısız[userID]}\``)
                });
                embed.addField(`BAŞARISIZ OLANLAR`, desc.join("\n"))
            }

            message.channel.send(embed)


        }
    }, 100);

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.üst
};
exports.help = {
    name: komutAdı,
    description: ``,
    usage: `${komutAdı}`
};