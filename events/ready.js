const moment = require('moment');
const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");

module.exports = client => {
  require("/app/util/süreKontrol")(client);
  require("/app/util/dgko")(client);
  require("/app/util/otoMesaj")(client);
  require("/app/util/anlıkKişi")(client);
  console.log(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Aktif, ${client.commands.size} komut yüklendi!`);
  console.log(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] ${client.user.tag} giriş yaptı.`);
  

}; 