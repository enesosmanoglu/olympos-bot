const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("/app/ayarlar");
const moment = require("moment");
moment.locale("tr");

module.exports = async (oldVoiceState, newVoiceState) => {
  const guild = newVoiceState.guild;
  const client = newVoiceState.guild.client;
  const userID = newVoiceState.id;
  const user = client.users.cache.find(u => u.id == userID);
  const member = guild.member(user);

  if (oldVoiceState.channelID && newVoiceState.channelID && oldVoiceState.channelID != newVoiceState.channelID) {
    const exVoiceChannel = guild.channels.cache.find(c => c.id == oldVoiceState.channelID)
    const voiceChannel = guild.channels.cache.find(c => c.id == newVoiceState.channelID)
    console.log(`[SES-LOG] [DEĞİŞTİ] || ${member.displayName} >> [${exVoiceChannel.name}] >> [${voiceChannel.name}] || ${user.tag} : ${user.id}`)
  } else if (!oldVoiceState.channelID && newVoiceState.channelID) {
    const voiceChannel = guild.channels.cache.find(c => c.id == newVoiceState.channelID)
    console.log(`[SES-LOG] [KATILDI] || ${member.displayName} >> [${voiceChannel.name}] || ${user.tag} : ${user.id}`)
  } else if (oldVoiceState.channelID && !newVoiceState.channelID) {
    const voiceChannel = guild.channels.cache.find(c => c.id == oldVoiceState.channelID)
    console.log(`[SES-LOG] [AYRILDI] || ${member.displayName} << [${voiceChannel.name}] || ${user.tag} : ${user.id}`)
  }

};
