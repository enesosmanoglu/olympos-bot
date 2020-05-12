const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');
const shortNumber = require('short-number');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {
    const guild = message.guild;
    const user = message.author;
    const userID = user.id;
    const member = message.member;

    if (args.length < 1) {
        return message.reply("burç gir")
    }

    const http = require('http')
    const cheerio = require('cheerio')
    const fetch = (method, url, payload = undefined) => new Promise((resolve, reject) => {
        http.get(
            url,
            res => {
                res.setEncoding('utf8');
                const dataBuffers = []
                res.on('data', data => {
                    console.log(data)
                    console.log(data.toString())
                    dataBuffers.push(data.toString())
                })
                res.on('end', () => resolve(dataBuffers.join('')))
            }
        ).on('error', reject)
    })

    const scrapeHtml = url => new Promise((resolve, reject) => {
        fetch('GET', url)
            .then(html => {
                const cheerioPage = cheerio.load(html)
                const productTable = cheerioPage('table#AutoNumber11 table tr:nth-child(6) p:nth-child(2)')
                resolve(productTable.text())
            })
            .catch(reject)
    })

    scrapeHtml(`http://www.astroloji.org/yildizfali/${args[0]}.asp`)
        .then(data => {
            console.log('data: ', data)
            message.channel.send(data)
        })
        .catch(err => console.log('err: ', err))
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