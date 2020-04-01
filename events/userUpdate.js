const Discord = require("discord.js");

module.exports = async (oldUser, newUser) => {

  if (oldUser.username == newUser.username) return; // user.username değişikliği yoksa dön

  if (oldUser.bot)
    // Bot engeli
    return;

  let client = oldUser.client;

  let guild = client.guilds.find(e => e.id == client.ayarlar.sunucu);

  if (!guild) return; // Sunucu yoksa dön


  console.log(guild.name);

  let oldMember = guild.members.cache.find(e => e.id == oldUser.id);
  let newMember = guild.members.cache.find(e => e.id == newUser.id);

  if (!oldMember || !newMember)
    return;

  let kayıtsızRol = guild.roles.cache.find(e => e.name == "Peasant of Olympos")

  if (!kayıtsızRol)
    console.log("Kayıtsız rolü bulunamadı")

  if (
    oldMember.roles.cache.length == 0 ||
    oldMember.roles.cache.has(kayıtsızRol.id)
  )
    return; // Kayıtsız üye engeli

  console.log("Kayıtlı üye");

  let tag = "✧";
  let tag2 = "✦";

  let taglıRol = guild.roles.cache.find(e => e.name == "Elite of Olympos");
  let tagsızRol = guild.roles.cache.find(e => e.name == "Rebel of Olympos");

  if (!taglıRol)
    return console.log("Taglı rol bulunamadı")
  if (!tagsızRol)
    return console.log("Tagsız rol bulunamadı")

  let oldName = oldUser.username;
  let newName = newUser.username;

  console.log(oldName, newName);
  let embedTitle;

  if (!oldName.includes(tag) && newName.includes(tag)) {
    // Tag eklemiş
    embedTitle = " tag ekledi.";
    console.log(oldMember.displayName + " tag ekledi.");
    await newMember.addRole(taglıRol);
    await newMember.removeRole(tagsızRol);
    await console.log("roller ayarlandı");
    /*
    if (oldMember.displayName.includes(tag2))
      newMember.setNickname(tag + newMember.displayName.slice(1, newMember.displayName.length));
    else
      newMember.setNickname(tag + " " + newMember.displayName);
    */

    if (newMember.displayName.startsWith("[AFK]")) {
      await newMember.setNickname(tag + " " + newMember.displayName.replace(tag, "").replace(tag2, "").trim());
    } else {
      await newMember.setNickname("[AFK] " + tag + " " + newMember.displayName.replace(tag, "").replace(tag2, "").replace("[AFK]", "").trim());
    }

  }
  if (oldName.includes(tag) && !newName.includes(tag)) {
    // Tag silmiş
    embedTitle = " tag sildi.";
    console.log(oldMember.displayName + " tag sildi.");
    await newMember.addRole(tagsızRol);
    await newMember.removeRole(taglıRol);
    await console.log("roller ayarlandı");
    /*
    if (oldMember.displayName.startsWith(tag))
      newMember.setNickname(tag2 + newMember.displayName.slice(1, newMember.displayName.length));
    else
      newMember.setNickname(tag2 + " " + newMember.displayName);
    */
    if (newMember.displayName.startsWith("[AFK]")) {
      await newMember.setNickname(tag2 + " " + newMember.displayName.replace(tag, "").replace(tag2, "").trim());
    } else {
      await newMember.setNickname("[AFK] " + tag2 + " " + newMember.displayName.replace(tag, "").replace(tag2, "").replace("[AFK]", "").trim());
    }
  }


  if (!embedTitle) return;

  let tagBilgi = guild.channels.cache.find(e => e.name == "tag-bilgi");
  if (tagBilgi)
    await tagBilgi.send(
      new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp()
        .setAuthor(newUser.tag, newUser.avatarURL)
        .setDescription(newUser + embedTitle)
    );
};
