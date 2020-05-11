const Discord = require('discord.js');

exports.run = function (client, message) {

  let member = message.mentions.members.first();

  if (!member)
    member = message.member


  message.channel.fetchWebhooks()
    .then(hooks => {
      if (hooks.size == 0) {
        message.channel.createWebhook(member.displayName, {
          avatar: member.user.displayAvatarURL({ dynamic: true, size: 2048 }),
          reason: 'Needed a cool new Webhook'
        })
          .then((webhook) => {
            sendWebhook(webhook)
          })
          .catch(console.error)
      } else {
        let webhook = hooks.first()
        webhook.edit({ avatar: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
          .then((webhook) => {
            sendWebhook(webhook)
          })
      }
    })
    .catch(console.error);

  function sendWebhook(webhook) {
    webhook.sendSlackMessage({
      'username': member.displayName,
      'attachments': [{
        //'pretext': '✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧',
        'color': '#2f3136',
        'image_url': member.user.displayAvatarURL({ dynamic: true, size: 2048 }),
      }]
    }).catch(console.error);
  }

  return;




};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['a', 'av'],
};

exports.help = {
  name: 'avatar',
  description: 'Avatarınızı gösterir',
  usage: 'avatar'
};