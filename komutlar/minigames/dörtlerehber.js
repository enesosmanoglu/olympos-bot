const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {
    const guild = message.guild;
    const user = message.author;
    const userID = user.id;
    const member = message.member;

    message.delete()

    let embed = new Discord.MessageEmbed()
        .setTitle("Dörtle - Oyun Rehberi")
        .setDescription(`
\`\`\`fix
• Oyun minimum 2, maksimum 6 kişiyle oynanabilmektedir. (4 kişiden fazlası tavsiye edilmemektedir. Eğlence içindir.)
• Oyunu oluşturan/başlatan oyuncu oyuna başlar.
• Oyuncular sırayla bir hamle yaparak ilerler.
• Sırası gelen oyuncu platformdaki sütunlardan birinin numarasını seçer.
• Seçilen sütunun en alt boş dairesine sıradaki kişinin renginde daire gönderilir ve sıra diğer oyuncuya geçer.
• Aynı renkli dairelerin 4 tanesini yatay, dikey veya çapraz yönde sıralayabilen oyuncu oyunu kazanır.
• Oyun, birisi oyunu kazanana veya boş daire kalmayana kadar devam eder.
• Oyuncular oyundan erken ayrılabilir. Kalan kişiler oyuna devam eder. Sona tek kişi kaldığı zaman sona kalan kişi oyunu kazanmış sayılır.
\`\`\`
        `)
        .addField(`Oyun oluşturma komutları`, "`o!dörtle` : **Herkesin katılabileceği açık oyun isteği oluşturur. Oyunun kişi sınırını oyun isteği açan kişi belirler. Oyunu oluşturan kişi oyunu başlatır.**\n`o!dörtle @kullanıcı @kullanıcı ...` : **Sadece etiketlenen kişilerin kabul edebileceği oyun isteği oluşturur. Herkes kabul edince oyun otomatik başlar.**")
        .attachFiles(['/app/assets/rehber.png'])
        .setImage(`attachment://rehber.png`)
        .setColor(ayarlar.renk)

    message.channel.send(embed)

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