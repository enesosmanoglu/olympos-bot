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

  client.guilds.cache.forEach(guild => {
    guild.channels.cache.filter(c => c.type == "voice").forEach(channel => {
      channel.members.forEach(member => {
        const voice = {
          guild: member.voice.guild,
          id: member.voice.id,
          serverDeaf: member.voice.serverDeaf,
          serverMute: member.voice.serverMute,
          selfDeaf: member.voice.selfDeaf,
          selfMute: member.voice.selfMute,
          sessionID: member.voice.sessionID,
          streaming: member.voice.streaming,
          channelID: null
        }
        console.log(member.voice.channelID)
        client.emit("voiceStateUpdate", voice, member.voice);
      });
    });
  });

}; 