const Discord = require('discord.js');
const db = require('quick.db');
const ayarlar = require("/app/ayarlar")
const moment = require("moment")
moment.locale('tr')

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {
    let c4ch = message.guild.channels.cache.find(c => c.name == "dörtle")

    if (message.channel.name != "dörtle" && c4ch)
        return message.reply(`Lütfen bu komutu <#${c4ch.id}> kanalında kullanınız!`)

    console.log(message.mentions.users.keyArray())

    if (message.mentions.users.keyArray().length != 0) {
        // belirli kişilere istek
        if (message.mentions.users.keyArray().some(u => u.id == message.author.id))
            return message.reply(new Discord.MessageEmbed()
                .setDescription(`Gerçekten kendinle oynayabileceğine inandın mı :)`)
                .setColor(ayarlar.renk)
                .setFooter(`Dörtle - Mini Oyun`)
            ).then(msg => msg.delete({ timeout: 5000 }))

        if (message.mentions.users.keyArray().length > 5)
            return message.reply(new Discord.MessageEmbed()
                .setDescription(`En fazla 5 kişi ile birlikte oynayabilirsiniz.`)
                .setColor(ayarlar.renk)
                .setFooter(`Dörtle - Mini Oyun`)
            ).then(msg => msg.delete({ timeout: 5000 }))

        let players = [message.author.id].concat(message.mentions.users.keyArray())
        let kişi = players.length

        let embed = new Discord.MessageEmbed()
            .setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle(`Oyun isteği açıldı! - ${kişi} Kişilik`)
            .setDescription(`Oyun isteğini kabul etmek için ✅ emojisini kullanınız.`)
            .setFooter(`Dörtle - Mini Oyun`)
            .setColor(ayarlar.renk)

        embed = addPlayers(embed)

        function addPlayers(embed, msg = null) {
            if (!embed.fields || !embed.fields[0])
                embed.fields = [{
                    "name": "İstek Gönderilen Kişiler",
                    "value": "."
                }]
            let playersDesc = []
            let r = msg ? msg.reactions.cache.find(r => r.emoji.name == "✅") : null;
            message.mentions.users.keyArray().forEach(userID => {
                playersDesc.push(`<@${userID}> ${(r ? r.users.cache.has(userID) : false) ? "☑️" : ""}`)
            });
            if (playersDesc.length == 0)
                playersDesc.push("Kimse yok")
            embed.fields[0].value = playersDesc.join("\n")
            return embed
        }

        message.channel.send(embed)
            .then(async msg => {
                await msg.react("✅")
                console.log(`[dörtle] [İSTEK] | ${message.author.id}`)

                const filter = (reaction, user) => reaction.emoji.name == "✅" && message.mentions.users.keyArray().some(id => id == user.id)
                const collector = msg.createReactionCollector(filter, { dispose: true });
                collector.on('collect', r => {
                    console.log(`Collected ${r.emoji.name}`)

                    if (r.emoji.name == "✅") {
                        let isFinished = true;
                        message.mentions.users.keyArray().forEach(id => {
                            if (!r.users.cache.has(id))
                                isFinished = false
                        })
                        embed = addPlayers(embed, msg)
                        msg.edit(embed)

                        if (isFinished)
                            collector.stop("Başlıyo")
                    }

                });
                collector.on('remove', r => {
                    console.log(`Removed ${r.emoji.name}`)
                    if (r.emoji.name == "✅") {
                        embed = addPlayers(embed, msg)
                        msg.edit(embed)
                    }
                });
                collector.on('dispose', r => {
                    console.log(`Disposed ${r.emoji.name}`)
                });
                collector.on('end', collected => {
                    console.log(`Collected ${collected.size} items`)
                    msg.delete()
                    let users = new Discord.Collection()
                    players.slice(0, kişi).forEach(playerID => {
                        if (playerID == message.author.id) return;
                        if (playerID == client.user.id) return;
                        users.set(playerID, { id: playerID })
                    });
                    message.mentions.users = users

                    require("./4le").run(client, message, [])
                });
            })

    } else {
        // katılım açık
        let kişi = 2;
        let players = [message.author.id]

        let embed = new Discord.MessageEmbed()
            .setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle(`Oyun isteği açıldı! - ${kişi} Kişilik`)
            .setDescription(`Oyun isteğini açan kişi dışındakiler ✅ emojisini kullanarak oyuna katılabilir.\n\nOyun isteğini açan kişi oyunun kişi sınırını numaralı emojilerle belirleyebilir ve ✅ emojisi ile oyunu başlatabilir.`)
            .setFooter(`Dörtle - Mini Oyun`)
            .setColor(ayarlar.renk)

        embed = addPlayers(embed)

        function addPlayers(embed) {
            if (!embed.fields || !embed.fields[0])
                embed.fields = [{
                    "name": "Oyuncular",
                    "value": ""
                }]
            let playersDesc = []
            players.forEach(userID => {
                playersDesc.push(`<@${userID}>`)
            });
            embed.fields[0].value = playersDesc.join("\n")
            return embed
        }

        message.channel.send(embed)
            .then(async msg => {
                let numbers = ["2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];

                ["✅"].concat(numbers).forEach(async button => {
                    await msg.react(button)
                    await console.log("reacted ", button)
                });
                console.log(`[dörtle] [İSTEK] | ${message.author.id}`)

                const filter = (reaction, user) => numbers.concat("✅").some(e => e == reaction.emoji.name) && user.id != client.user.id
                const collector = msg.createReactionCollector(filter, { dispose: true });
                collector.on('collect', r => {
                    console.log(`Collected ${r.emoji.name}`)

                    if (numbers.some(e => e == r.emoji.name)) {
                        if (r.users.cache.has(message.author.id)) {
                            kişi = numbers.indexOf(r.emoji.name) + 2
                            embed.setTitle(`Oyun isteği açıldı! - ${kişi} Kişilik`);
                            msg.edit(embed)
                        }
                        r.users.cache.forEach(user => {
                            if (user.id == client.user.id) return;
                            r.users.remove(user)
                        });
                    }
                    if (r.emoji.name == "✅") {
                        if (r.users.cache.has(message.author.id)) {
                            collector.stop("Oyun açılacak.")
                        } else {
                            players = [message.author.id].concat(r.users.cache.keyArray().filter(id => id != client.user.id))
                            embed = addPlayers(embed)
                            msg.edit(embed)
                        }
                    }

                });
                collector.on('remove', r => {
                    console.log(`Removed ${r.emoji.name}`)
                    if (r.emoji.name == "✅") {
                        players = [message.author.id].concat(r.users.cache.keyArray().filter(id => id != client.user.id))
                        embed = addPlayers(embed)
                        msg.edit(embed)
                    }
                });
                collector.on('dispose', r => {
                    console.log(`Disposed ${r.emoji.name}`)
                });
                collector.on('end', collected => {
                    console.log(`Collected ${collected.size} items`)
                    msg.delete()
                    let users = new Discord.Collection()
                    players.slice(0, kişi).forEach(playerID => {
                        if (playerID == message.author.id) return;
                        if (playerID == client.user.id) return;
                        users.set(playerID, { id: playerID })
                    });
                    message.mentions.users = users

                    require("./4le").run(client, message, [])
                });
            })
    }


}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.taglı
};
exports.help = {
    name: komutAdı,
    description: ``,
    usage: `${komutAdı}`
};