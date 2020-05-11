const Discord = require('discord.js');
const db = require('quick.db');
const ayarlar = require("/app/ayarlar")
const moment = require("moment")
moment.locale('tr')

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {
    if (message.content.startsWith(ayarlar.prefix + "4le"))
        return message.reply(new Discord.MessageEmbed()
            .setTitle("Lütfen `" + ayarlar.prefix + "dörtle` komutunu kullanınız.")
            .setDescription(`Ayrıntılar için <#704450944536019064> kanalına bakabilirsiniz.`)
            .setColor(ayarlar.renk)
            .setFooter(`Dörtle - Mini Oyun`)
        ).then(msg => msg.delete({ timeout: 10000 }))

    let allies = [];
    message.mentions.users.forEach(user => {
        allies.push(user)
        console.log("Player added: " + user.tag)
    });

    if (allies.length < 1)
        return message.reply(new Discord.MessageEmbed()
            .setDescription(`Yeterli sayıda oyuncu olmadığı için oyun başlatılamıyor!`)
            .setColor(ayarlar.renk)
            .setFooter(`Dörtle - Mini Oyun`)
        ).then(msg => msg.delete({ timeout: 5000 }))

    if (allies.some(u => u.id == message.author.id))
        return message.reply(new Discord.MessageEmbed()
            .setDescription(`Gerçekten kendinle oynayabileceğine inandın mı :)`)
            .setColor(ayarlar.renk)
            .setFooter(`Dörtle - Mini Oyun`)
        ).then(msg => msg.delete({ timeout: 5000 }))

    let emojis = {
        boş: "_0",
        çıkış: "_exit",
    }
    let paketler = [
        // zeus: _a
        // poseidon: _b
        // athena: _c
        // aphrodite: _d
        // demeter: _e
        // hestia: _f
        ["_a", "_e", "_d", "_f", "_b", "_c"],
        ["_b", "_c", "_f", "_a", "_e", "_d"],
        ["_c", "_e", "_a", "_b", "_d", "_f"],
        ["_a", "_d", "_b", "_f", "_e", "_c"],
        ["_b", "_f", "_c", "_a", "_d", "_e"],
    ]

    if (allies.length > paketler[0].length - 1)
        return message.reply(new Discord.MessageEmbed()
            .setDescription(`En fazla ${paketler[0].length - 1} kişiyle birlikte oynayabilirsiniz.`)
            .setColor(ayarlar.renk)
            .setFooter(`Dörtle - Mini Oyun`)
        ).then(msg => msg.delete({ timeout: 5000 }))

    // emojiler
    let suffixes = ["", "1", "2", "3", "4"]
    paketler.forEach(paket => {
        paket.forEach(rol => {
            suffixes.forEach(suffix => {
                emojis[rol + suffix] = rol + suffix;
            });
        });
    });

    // sayı emojiler
    for (let i = 1; i < 10; i++) {
        emojis["_" + i] = "_" + i;
    }

    // get emojis
    Object.keys(emojis).forEach(emoji => {
        emojis[emoji] = client.emojis.cache.find(e => e.name == emojis[emoji])
    });
    let olmayanlar = []
    Object.keys(emojis).forEach(emoji => {
        let emote = emojis[emoji]
        if (!emote) olmayanlar.push(emoji)
    });
    if (olmayanlar.length != 0)
        return message.reply("Eksik emojiler var:\n\n" + olmayanlar.join("\n"))

    // map
    let game = [
        [emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş],
        [emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş],
        [emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş],
        [emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş],
        [emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş],
        [emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş],
        [emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş],
        [emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş, emojis.boş],
        [emojis._1, emojis._2, emojis._3, emojis._4, emojis._5, emojis._6, emojis._7, emojis._8, emojis._9],
    ]
    let gameID = db.has(`c4_${message.guild.id}`) ? Object.keys(db.get(`c4_${message.guild.id}`)).length : 0;
    let alliesIDs = []
    allies.forEach(ally => {
        alliesIDs.push(ally.id)
    });

    let paket = paketler[gameID % paketler.length]

    let c4 = {
        id: gameID,
        game: game,
        players: [message.author.id, ...alliesIDs],
        kaçaklar: [],
        kaçaklarEmoji: [],
        timestamps: {
            started: 0,
            finished: 0,
        },
        playerEmojis: Object.values(Object.fromEntries(Object.entries(emojis).filter(a => paket.some(r => r == a[0])).sort((a, b) => paket.indexOf(a[0]) - paket.indexOf(b[0])))),
        sıra: 0,
        round: 1,
    }

    function getEmbed(c4) {
        c4.isDraw = true;
        let gameDesc = []
        c4.game.forEach(satır => {
            gameDesc.push(satır.join(""))
            satır.forEach(x => {
                if (!c4.isDraw) return;
                if (x == emojis.boş)
                    c4.isDraw = false
            });
        });

        let sıradaki = message.guild.members.cache.find(u => u.id == c4.players[c4.sıra]);
        let kazanan = c4.winner ? message.guild.members.cache.find(u => u.id == c4.players[c4.playerEmojis.indexOf(c4.winner)]) : { displayName: "Hata" }
        let embed = new Discord.MessageEmbed()
            .setDescription(gameDesc.join("\n"))

        if (c4.isDraw && !c4.winner) {
            //berabere
            embed
                .setTitle(`Oyun berabere bitti!`)
                .setFooter(`dörtle - #${c4.id} - ${c4.round - 1} tur`)
                .setColor(ayarlar.renk)
        } else {
            let oyuncu = c4.winner ? kazanan : sıradaki

            let renk = ""

            switch (c4.winner ? c4.winner : c4.playerEmojis[c4.sıra]) {
                case emojis._a: // zeus
                    renk = `55a786`
                    break;
                case emojis._b: // poseidon
                    renk = `00799e`
                    break;
                case emojis._c: // athena
                    renk = `b97348`
                    break;
                case emojis._d: // aphrodite
                    renk = `923352`
                    break;
                case emojis._e: // demeter
                    renk = `8a6391`
                    break;
                case emojis._f: // hestia
                    renk = `919233`
                    break;
                default:
                    renk = ayarlar.renk
                    break;
            }

            embed
                .setAuthor(oyuncu.displayName, oyuncu.user.displayAvatarURL({ dynamic: true }))
                .setColor(renk)

            if (c4.winner) {
                // kazanan var
                embed
                    .setTitle(`Oyunu kazandı!`)
                    .setFooter(`dörtle - #${c4.id} - ${c4.round} tur`)
            } else {
                // dewamke
                embed
                    .setFooter(`dörtle - #${c4.id} - ${c4.round}. tur`)
            }
        }

        return embed;
    }

    function getDesc(c4) {
        let playersDesc = []
        let j = 0;
        c4.kaçaklar.forEach(kaçak => {
            playersDesc.push(`${c4.kaçaklarEmoji[j++]}: <@${kaçak}> (çıktı)`)
        });
        let i = 0;
        c4.players.forEach(player => {
            playersDesc.push(`${c4.playerEmojis[i++]}: <@${player}>`)
        });
        if (c4.round == 1)
            playersDesc.push(`${emojis.çıkış}: Oyundan çık.`)
        return playersDesc.join("\n");
    }

    message.channel.send(getDesc(c4), getEmbed(c4))
        .then(async mesaj => {
            c4.chID = mesaj.channel.id;
            c4.msgID = mesaj.id;

            exports.start = m => start(m);

            console.log(`[dörtle] [#${c4.id}] [BAŞLADI] | Oyuncular:  ${c4.players.join(" & ")}`)
            c4.timestamps.started = moment().utcOffset(3).format('x')
            db.set(`c4_${message.guild.id}.${c4.id}`, c4)

            start(c4, mesaj)
            function start(c4, msg) {
                // Create a reaction collector
                const filter = (reaction, user) => game[game.length - 1].concat(emojis.çıkış).some(e => e.name == reaction.emoji.name) && c4.players.some(p => p == user.id) && user.id != client.user.id;
                //const filter = (reaction, user) => game[game.length - 1].some(e => e == reaction.emoji.name) && c4.players.some(p => p == user.id);
                const collector = msg.createReactionCollector(filter, {});

                function editGame(c4) {
                    // checking end
                    for (let y = 0; y < c4.game.length - 1; y++) {
                        if (c4.winner) {
                            break;
                        };
                        for (let x = 0; x < c4.game[y].length; x++) {
                            if (c4.winner) {
                                break;
                            };
                            let yy = c4.game.length - 2 - y;
                            let k = c4.game[yy][x]
                            if (k == emojis.boş) {
                                continue;
                            }

                            function right(x, y) {
                                // console.log("checking ", x, y)
                                return c4.game[y][x + 1] ? c4.game[y][x + 1] : emojis.boş
                            }
                            function up(x, y) {
                                // console.log("checking ", x, y)
                                return c4.game[y - 1] ? c4.game[y - 1][x] : emojis.boş
                            }
                            function upright(x, y) {
                                // console.log("checking ", x, y)
                                return (c4.game[y - 1] && c4.game[y - 1][x + 1]) ? c4.game[y - 1][x + 1] : emojis.boş
                            }
                            function upleft(x, y) {
                                // console.log("checking ", x, y)
                                return (c4.game[y - 1] && c4.game[y - 1][x - 1]) ? c4.game[y - 1][x - 1] : emojis.boş
                            }

                            // checking lineal
                            if (right(x, yy) == k) {
                                if (right(x + 1, yy) == k) {
                                    if (right(x + 2, yy) == k) {
                                        c4.winner = k;
                                        let newEmoji = emojis[k.name + suffixes[1]]
                                        c4.game[yy][x] = newEmoji
                                        c4.game[yy][x + 1] = newEmoji
                                        c4.game[yy][x + 2] = newEmoji
                                        c4.game[yy][x + 3] = newEmoji
                                    }
                                }
                            }

                            if (up(x, yy) == k) {
                                if (up(x, yy - 1) == k) {
                                    if (up(x, yy - 2) == k) {
                                        c4.winner = k;
                                        let newEmoji = emojis[k.name + suffixes[2]]
                                        c4.game[yy][x] = newEmoji
                                        c4.game[yy - 1][x] = newEmoji
                                        c4.game[yy - 2][x] = newEmoji
                                        c4.game[yy - 3][x] = newEmoji
                                    }
                                }
                            }

                            if (upright(x, yy) == k) {
                                if (upright(x + 1, yy - 1) == k) {
                                    if (upright(x + 2, yy - 2) == k) {
                                        c4.winner = k;
                                        let newEmoji = emojis[k.name + suffixes[3]]
                                        c4.game[yy][x] = newEmoji
                                        c4.game[yy - 1][x + 1] = newEmoji
                                        c4.game[yy - 2][x + 2] = newEmoji
                                        c4.game[yy - 3][x + 3] = newEmoji
                                    }
                                }
                            }

                            if (upleft(x, yy) == k) {
                                if (upleft(x - 1, yy - 1) == k) {
                                    if (upleft(x - 2, yy - 2) == k) {
                                        c4.winner = k;
                                        let newEmoji = emojis[k.name + suffixes[4]]
                                        c4.game[yy][x] = newEmoji
                                        c4.game[yy - 1][x - 1] = newEmoji
                                        c4.game[yy - 2][x - 2] = newEmoji
                                        c4.game[yy - 3][x - 3] = newEmoji
                                    }
                                }
                            }

                        }
                    }

                    if (c4.players.length < 2)
                        c4.winner = c4.playerEmojis[0]

                    let kazanan = c4.winner ? message.guild.members.cache.find(u => u.id == c4.players[c4.playerEmojis.indexOf(c4.winner)]) : { displayName: "Hata" }

                    msg.edit(getDesc(c4), getEmbed(c4)).then(mess => {
                        if (c4.winner || c4.isDraw) {
                            db.set(`c4_${message.guild.id}.${c4.id}.timestamps.finished`, moment().utcOffset(3).format('x'))
                            console.log(`[dörtle] [#${c4.id}] [BİTTİ] | Kazanan:  ${c4.winner ? kazanan.displayName : "BERABERE"}`)
                            collector.stop("Oyun bitti.")
                            mess.reactions.removeAll()
                        }
                    })
                }

                collector.on('collect', r => {
                    console.log(`Collected ${r.emoji.name}`)
                    let user = r.users.cache.find(u => c4.players.some(p => p == u.id));
                    let userID = user.id;
                    r.users.cache.forEach(user => {
                        if (user.id == client.user.id) return;
                        r.users.remove(user)
                    });

                    if (r.emoji == emojis.çıkış) {
                        c4.kaçaklarEmoji.push(c4.playerEmojis.splice(c4.players.indexOf(userID), 1)[0])
                        c4.kaçaklar.push(c4.players.splice(c4.players.indexOf(userID), 1)[0])
                        editGame(c4)
                        return;
                    }

                    if (c4.players[c4.sıra] != userID) return;
                    console.log(`[dörtle] [#${c4.id}] [ADIM] |  ${user.tag} kullandı: ${r.emoji.name}`)


                    let index = c4.game[c4.game.length - 1].indexOf(r.emoji)
                    //let index = c4.game[c4.game.length - 1].indexOf(r.emoji.name)

                    let isPlayed = false;
                    for (let i = 0; i < c4.game.length - 1; i++) {
                        let satır = c4.game[(c4.game.length - 2) - i];
                        if (satır[index] == emojis.boş) {
                            satır[index] = c4.playerEmojis[c4.sıra]
                            isPlayed = true;
                            break;
                        }
                    }
                    if (isPlayed) {
                        c4.round += 1;
                        c4.sıra = (c4.sıra + 1) % c4.players.length
                        editGame(c4)
                    }
                    //console.log(JSON.stringify(c4.game))
                });
                collector.on('end', collected => {
                    //console.log(`Collected ${collected.size} items`)
                });

                game[game.length - 1].concat(emojis.çıkış).forEach(async emoji => {
                    await msg.react(emoji)
                });
            }
        })

};

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