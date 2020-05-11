const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const shortNumber = require('short-number');
const moment = require('moment');
moment.locale('tr')

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {
    const guild = message.guild;
    const user = message.author;
    const userID = user.id;
    const member = message.member;


    if (args.length != 1 || !["ses", "mesaj", "oyun"].some(t => t == args[0]))
        return message.reply("Lütfen ek olarak sadece puan türünü girin. (ses/mesaj/oyun)")

    let ay1 = moment().utcOffset(3).subtract(1, "month").format('YYYYMM')
    let ay2 = moment().utcOffset(3).format('YYYYMM')

    let db0 = db.get(`ranks_${guild.id}.${args[0]}`)
    let db1 = db.get(`ranks_${guild.id}.aylık.${ay1}.${args[0]}`)
    let db2 = db.get(`ranks_${guild.id}.aylık.${ay2}.${args[0]}`)

    if (!db0 || !db1 || !db2)
        return message.react("❌")

    message.react("✅")
    let desc = []
    Object.keys(db1).forEach(userID => {
        let rank0 = db0[userID]
        let rank1 = db1[userID]
        let rank2 = db2[userID]
        if (!rank2) return;

        let exp0 = rank0.expCurrent
        let exp1 = rank1.expCurrent
        let exp2 = rank2.expCurrent

        if (!~~exp1 || !~~exp2)
            return

        if (exp0 > parseInt(exp1) + parseInt(exp2))
            return

        if (exp2 > exp1) {
            desc.push(parseFloat(db.get(`ranks_${guild.id}.${args[0]}.${userID}.expCurrent`)) - parseFloat(db.get(`ranks_${guild.id}.aylık.${ay1}.${args[0]}.${userID}.expCurrent`)))
            let yeniExp = parseFloat(db.get(`ranks_${guild.id}.${args[0]}.${userID}.expCurrent`)) - parseFloat(db.get(`ranks_${guild.id}.aylık.${ay1}.${args[0]}.${userID}.expCurrent`))
            let current = db.get(`ranks_${guild.id}.aylık.${ay2}.${args[0]}.${userID}`)
            console.log(current)

            //db.set(`ranks_${guild.id}.aylık.${ay2}.${args[0]}.${userID}.expCurrent`)
            //desc.push(`<@${userID}>:\nNisan:**${exp1}**\nMayıs:**${exp2}**\nTOPLAM:**${exp0}**\n`)
        }
    });

    message.reply(new Discord.MessageEmbed().setDescription(desc.join("\n")))

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