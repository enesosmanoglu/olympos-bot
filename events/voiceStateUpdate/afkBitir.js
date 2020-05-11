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

  if (user.bot) return;

  let logChannel = guild.channels.cache.find(c => c.name == "afk-logs")

  if (oldVoiceState.channelID && newVoiceState.channelID && (oldVoiceState.channelID != newVoiceState.channelID)) {
    // oda değiştirmiş

    if (member.displayName.includes("[AFK]") && db.has(`afk_${guild.id}.${userID}`)) {
      // ÖNCEDEN AFK
      await member.setNickname(member.displayName.replace("[AFK]", ""))
      await db.delete(`afk_${guild.id}.${userID}`)
      if (logChannel)
        await logChannel.send(new Discord.MessageEmbed().setDescription(`<@${userID}>, artık afk değil.`).setColor("GREEN"))
    }

  }


};

