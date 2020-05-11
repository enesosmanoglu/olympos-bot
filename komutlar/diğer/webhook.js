'use strict';
const Discord = require('discord.js');
const ayarlar = require("/app/ayarlar");
const db = require('quick.db');

const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")

exports.run = async (client, message, args) => {

    message.delete()

    if (args.length == 0)
        return;

    message.channel.fetchWebhooks()
        .then(hooks => {

            if (hooks.size == 0) {
                message.channel.createWebhook(message.member.displayName, {
                    avatar: message.author.displayAvatarURL({ dynamic: true }),
                    reason: 'Needed a cool new Webhook'
                })
                    .then((webhook) => {
                        sendWebhook(webhook)
                    })
                    .catch(console.error)
            } else {
                let webhook = hooks.first()
                webhook.edit({ avatar: message.author.displayAvatarURL({ dynamic: true }) })
                    .then((webhook) => {
                        sendWebhook(webhook)
                    })
            }
        })
        .catch(console.error);

    function sendWebhook(webhook) {
        webhook.sendSlackMessage({
            'username': message.member.displayName,
            'text': message.content.replace(`${ayarlar.prefix}${komutAdı} `, "")
        }).catch(console.error);
    }

    return;
    // Create a new webhook
    const webhook = new Discord.WebhookClient('699553349665554453', 'slYDEPRgLVriZKeB2cF3_La2Zf9tdvIjro5lU_TYN9DMiuDlAWIIDG1RxDgBzyWG-1Rz');
    // Send a message using the webhook
    //webhook.send('I am now alive!');
    // Send a slack message
    webhook.edit({ avatar: message.author.displayAvatarURL({ dynamic: true }) })
        .then((webhook) => {
            webhook.sendSlackMessage({
                'username': message.member.displayName,
                'attachments': [{
                    'pretext': '✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧',
                    'color': '#2f3136',
                    'image_url': message.author.displayAvatarURL({ dynamic: true, size: 2048 }),
                }]
            }).catch(console.error);
        })

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