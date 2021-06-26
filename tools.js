const { MessageEmbed } = require("discord.js");

module.exports.sendWebhook = (channel, username, content, avatarURL) => {
    channel.fetchWebhooks()
        .then(webhook => {
            let foundHook = webhook.find(w => w.name == channel.client.user.username);

            if (!foundHook) {
                channel.createWebhook(channel.client.user.username, channel.client.user.displayAvatarURL())
                    .then(webhook => {
                        webhook.send('', {
                            'username': username,
                            'avatarURL': avatarURL,
                            'content': content
                        })
                            .catch(error => console.log(error));
                    })
            } else {
                foundHook.send(content, {
                    'username': username,
                    'avatarURL': avatarURL
                })
                    .catch(error => console.log(error));
            }
        })
}

module.exports.errorMsg = (message, title, description) => {
    const channel = message.channel;
    if (message.channel.type == 'text') {
        message.delete();
    }
    
    const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(0xED4245);

    channel.send(embed)
        .then(m => {
            m.delete({ timeout: 5000 })
            .catch(error => console.log(error))
        });
}