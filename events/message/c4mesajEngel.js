const Discord = require("discord.js");
const ayarlar = require("/app/ayarlar");

module.exports = async message => {
    if (message.channel.name == "dörtle" && !message.content.startsWith(ayarlar.prefix + "dörtle")) { //
        if (message.embeds.length != 0) {
            if (!message.embeds[0].footer || !message.embeds[0].footer.text || !message.embeds[0].footer.text.toLowerCase().startsWith("dörtle"))
                message.delete({ timeout: 2000 })
        } else {
            message.delete({ timeout: 2000 })
        }
    }
}