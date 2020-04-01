const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar.json");
const db = require('quick.db');
const backup = require('discord-backup')

exports.run = async (client, message, args) => {
  backup.setStorageFolder("/app/backups/");
  backup.list().then((backups) => {
    let msg;
    
    message.reply(new Discord.MessageEmbed().setTitle("Yedekler yükleniyor...")).then(m => {
      msg=m
      
      let yedekler = []
    
      backups.forEach(yedek => {
        
        backup.fetch(yedek).then((backupInfos) => {
            console.log(backupInfos)
            const date = new Date(backupInfos.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
            const formatedDate = `${(dd[1]?dd:"0"+dd[0])}/${(mm[1]?mm:"0"+mm[0])}/${yyyy}`;
          
            yedekler.push("_" + formatedDate + "_ : **" + yedek + "**")
            msg.edit(new Discord.MessageEmbed().setTitle("Yedekler").setDescription(yedekler.join("\n")));
        })
        
      })   
    })
     
    
      
  }); 
  

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['yedekliste','yedeklistesi'],
    perms: ayarlar.perms.üst // => Yetkisiz komut: @everyone
};

exports.help = {
    name: __filename.replace(__dirname,"").replace("/","").replace(".js",""),
    description: '',
    usage: 'yedekler'
};