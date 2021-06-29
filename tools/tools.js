const { MessageEmbed } = require("discord.js");
const config = require('../config.json');

// General tools
module.exports.log = (content, guild) => {
    var time = format12Hour(new Date);
    var location; // Guild name or client
    if (guild) {
        location = guild.name;
    } else {
        location = 'Client'
    }
    console.log(`[${time}] ${location} > ${content}`);
}

module.exports.format12Hour = format12Hour;
function format12Hour (date) {
    var hours = date.getHours() % 12; // 12 hour time
    hours = hours ? hours : 12; // 0 -> 12
    var minutes = date.getMinutes();
    minutes = minutes < 10 ?  '0' + minutes : minutes; // 1 -> 01 
    return `${hours}:${minutes}${hours >= 12 ? 'am' : 'pm'}`;
}

// Message tools
module.exports.errorMsg = (message, title, description) => {
    message.delete();
    
    const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(config.failColour);

    message.channel.send(embed)
        // Deleting response after 5 seconds
        .then(m => {
            m.delete({ timeout: 5000 })
            .catch(error => console.log(error))
        });
}

module.exports.sendWebhook = (channel, username, content, avatarURL) => {
    channel.fetchWebhooks()
        .then(webhook => {
            let foundHook = webhook.find(w => w.name == channel.client.user.username);
            // If channel has webhook
            if (!foundHook) {
                // Create webhook
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