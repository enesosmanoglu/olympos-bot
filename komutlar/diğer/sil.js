const { MessageEmbed } = require ('discord.js')
const ayarlar = require("/app/ayarlar");

exports.run = (Bot, Mesaj, Argüman) => {
  
  const Sayı = Number (Argüman [0])
  
  const error = new MessageEmbed ()
  .setColor ('#RANDOM')
  .setTitle ('Dikkat!')
  .setFooter (Bot.user.username, Bot.user.avatarURL)
  .setTimestamp ()
  
  const Başarılı = new MessageEmbed ()
  .setColor ('#RANDOM')
  .setTitle ('Başarılı!')
  .setFooter (Bot.user.username, Bot.user.avatarURL)
  .setTimestamp ()
 
  {
    
      if (!Sayı) {
        error.setDescription ('Bir sayı belirmelisin. -.-')
        Mesaj.channel.send (error)
      } else {
        if (Sayı < 101) {
          Başarılı.setDescription (`${Sayı} adet mesaj silindi. :cloud_tornado:`)
          Mesaj.channel.send(new MessageEmbed().setDescription(`${Sayı} adet mesaj silindi. :cloud_tornado:`).setColor('000').setTimestamp()).then(msg => msg.delete({ timeout: 10000 }))
          Mesaj.channel.bulkDelete (Sayı)
        }
        if (Sayı > 100 && Sayı < 200) {
          Başarılı.setDescription (`${Sayı} adet mesaj silindi. :cloud_tornado:`)
          Mesaj.channel.send(new MessageEmbed().setDescription(`${Sayı} adet mesaj silindi. :cloud_tornado:`).setColor('000').setTimestamp()).then(msg => msg.delete({ timeout: 10000 }))
          Mesaj.channel.bulkDelete (100).then (() => {
            Mesaj.channel.bulkDelete (Sayı - 100)
          })
        }
        if (Sayı > 200 && Sayı < 300) {
          Başarılı.setDescription (`${Sayı} adet mesaj silindi. :cloud_tornado:`)
          Mesaj.channel.send(new MessageEmbed().setDescription(`${Sayı} adet mesaj silindi. :cloud_tornado:`).setColor('000').setTimestamp()).then(msg => msg.delete({ timeout: 10000 }))
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100).then (() => {
            Mesaj.channel.bulkDelete (Sayı - 200)
          })
        }
        if (Sayı > 300 && Sayı < 400) {
          Başarılı.setDescription (`${Sayı} adet mesaj silindi. :cloud_tornado:`)
          Mesaj.channel.send(new MessageEmbed().setDescription(`${Sayı} adet mesaj silindi. :cloud_tornado:`).setColor('000').setTimestamp()).then(msg => msg.delete({ timeout: 10000 }))
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100).then (() => {
            Mesaj.channel.bulkDelete (Sayı - 300)
          })
        }
        if (Sayı > 400 && Sayı < 500) {
          Başarılı.setDescription (`${Sayı} adet mesaj silindi. :cloud_tornado:`)
          Mesaj.channel.send(new MessageEmbed().setDescription(`${Sayı} adet mesaj silindi. :cloud_tornado:`).setColor('000').setTimestamp()).then(msg => msg.delete({ timeout: 10000 }))
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100).then (() => {
            Mesaj.channel.bulkDelete (Sayı - 400)
          })
        }
        if (Sayı > 500 && Sayı < 600) {
          Başarılı.setDescription (`${Sayı} adet mesaj silindi. :cloud_tornado:`)
          Mesaj.channel.send(new MessageEmbed().setDescription(`${Sayı} adet mesaj silindi. :cloud_tornado:`).setColor('000').setTimestamp()).then(msg => msg.delete({ timeout: 10000 }))
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100).then (() => {
            Mesaj.channel.bulkDelete (Sayı - 500)
          })
        }
        if (Sayı > 600 && Sayı < 700) {
          Başarılı.setDescription (`${Sayı} adet mesaj silindi. :cloud_tornado:`)
          Mesaj.channel.send(new MessageEmbed().setDescription(`${Sayı} adet mesaj silindi. :cloud_tornado:`).setColor(000).setTimestamp()).then(msg => msg.delete({ timeout: 10000 }))
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100).then (() => {
            Mesaj.channel.bulkDelete (Sayı - 600)
          })
        }
        if (Sayı > 700 && Sayı < 800) {
          Başarılı.setDescription (`${Sayı} adet mesaj silindi. :cloud_tornado:`)
          Mesaj.channel.send(new MessageEmbed().setDescription(`${Sayı} adet mesaj silindi. :cloud_tornado:`).setColor(000).setTimestamp()).then(msg => msg.delete({ timeout: 10000 }))
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100).then (() => {
            Mesaj.channel.bulkDelete (Sayı - 700)
          })
        }
        if (Sayı > 800 && Sayı < 900) {
          Başarılı.setDescription (`${Sayı} adet mesaj silindi. :cloud_tornado:`)
          Mesaj.channel.send(new MessageEmbed().setDescription(`${Sayı} adet mesaj silindi. :cloud_tornado:`).setColor(000).setTimestamp()).then(msg => msg.delete({ timeout: 10000 }))
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100).then (() => {
            Mesaj.channel.bulkDelete (Sayı - 800)
          })
        }
        if (Sayı > 900 && Sayı < 1000) {
          Başarılı.setDescription (`${Sayı} adet mesaj silindi. :cloud_tornado:`)
          Mesaj.channel.send(new MessageEmbed().setDescription(`${Sayı} adet mesaj silindi. :cloud_tornado:`).setColor(000).setTimestamp()).then(msg => msg.delete({ timeout: 10000 }))
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100).then (() => {
            Mesaj.channel.bulkDelete (Sayı - 900)
          })
        }
        
        if (Sayı == 1000) {
          Başarılı.setDescription (`${Sayı} adet mesaj silindi. :cloud_tornado:`)
          Mesaj.channel.send(new MessageEmbed().setDescription(`${Sayı} adet mesaj silindi. :cloud_tornado:`).setColor(000).setTimestamp()).then(msg => msg.delete({ timeout: 10000 }))
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
          Mesaj.channel.bulkDelete (100)
        }
        if (Sayı > 50) {
          error.setDescription ('En fazla 50 adet mesaj silmenizi öneririz.').setColor(000).setTimestamp().then(msg => msg.delete({ timeout: 10000 }))
          Mesaj.channel.send (error)
        }
      }
    }
}

exports.conf = {
    perms: ayarlar.perms.üstyönetim,
    // => Yetkisiz komut: ["@everyone"]
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
  enabled: true,
  guildOnly: false,
  aliases: ['sil']
}

exports.help = {
  name: 'sil'
}
