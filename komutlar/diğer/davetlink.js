exports.run = async (client, message, args) => {
    try {
      let invite = await message.channel.createInvite({
        maxAge: args.age * 60,
        maxUses: args.uses
      });
  
      message.channel.send('24 saat süreli davet linki veriyorum: \n' +
        `https://discord.gg/${invite.code}`).catch(e => {
        client.log.error(e);
      });
    }
    catch (e) {
      client.log.error(e);
    }
  };
  
  exports.conf = {
    perms: ["Apollo","Artemis"],
    // => Yetkisiz komut: @everyone
    // => Sadece kayıtlılar: ["Apollo", "Artemis"]
    enabled: true,
    guildOnly: false,
    aliases: ['davetlink'],
    permLevel: 0
  };
  
  exports.help = {
    name: 'davetlink',
    description: 'Olympos davet linkini atar.',
    usage: 'davetlink'
  };
  
