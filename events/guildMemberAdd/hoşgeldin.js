const discord = require("discord.js");
const ayarlar = require("/app/ayarlar");
let client;

module.exports = member => {
    client = member.guild.client;

    let kayıtsızRol = member.guild.roles.cache.find(r => r.name == "Peasant of Olympos");
    if (kayıtsızRol)
        member.roles.add(kayıtsızRol)
            .then(() => {
                console.log(`Yeni gelen kişiye kayıtsız rolü eklendi. (${member.user.tag})`)
            })

    // Sunucu emojileri (ilki: aranan emoji, ikincisi: ilki bulunamazsa kullanılacak basic emoji)
    let emoji = getEmoji("blackx", "small_orange_diamond");
    let emoji2 = getEmoji("BreathTaking", "low_brightness");
    let emoji3 = getEmoji("OkPinkSpinningHand", "wave");

    let username = member.user.username;

    const embed = new discord.MessageEmbed()
        .setColor("BLACK")
        .setImage("https://i.hizliresim.com/PR5YK2.png")
        .setDescription(`
${emoji} **Merhaba ${username}** ${emoji}
            
• Nickinin başına "✧" tagini ekleyerek siyah **Elite of Olympos** rolüne sahip olabilir, tag özel çekilişlerine katılabilirsin.
• Tag aldıktan sonra rolün otomatik olarak yenilenir, herhangi bir şey yapmana gerek yok.

Olymposta görüşmek üzere! ${emoji3}
https://www.olymposweb.com
`)

    member.send(embed);

    let kayitKanali = member.guild.channels.cache.find(c => c.name == "kayıt");

    if (kayitKanali)
        kayitKanali.send(`
${emoji2} Merhaba ${member.user},
• Şu an görüş açın çok sınırlı, kayıt odasına girip yetkilileri etiketlemelisin. 
• Ses teyit ettirdikten sonra tüm odalara erişebilirsin. ${getEmoji("OkPinkSpinningHand", "woman_raising_hand")}

${member.guild.roles.cache.find(r => r.name == "Dionysos")}
`);
};

function getEmoji(emojiName, defaultEmoji) {
    let emoji = client.emojis.cache.find(e => e.name == emojiName);
    if (!emoji) emoji = ":" + defaultEmoji + ":"; // Üstteki emoji bulunamazsa varsayılan emoji (discord basic emojis)
    return emoji;
}