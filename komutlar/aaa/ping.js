const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {

    const m = await message.channel.send("Ping test");
    console.log(`Latency: ${m.createdTimestamp - message.createdTimestamp}ms`);
    console.log(`API Latency ${Math.round(client.ws.ping)}ms`);
    message.channel.send(`Latency: ${m.createdTimestamp - message.createdTimestamp}ms`);
    message.channel.send(`API Latency ${Math.round(client.ws.ping)}ms`);

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