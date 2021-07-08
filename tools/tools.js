const { MessageEmbed } = require("discord.js");
const config = require('../config.json');

// General tools
module.exports.log = (content, guild) => {
    let time = format12Hour(new Date);
    let location; // Guild name or client
    if (guild) {
        location = guild.name;
    } else {
        location = 'Client'
    }
    console.log(`[${time}] ${location} > ${content}`);
}

module.exports.format12Hour = format12Hour;
function format12Hour (date) {
    let hours = date.getHours() % 12; // 12 hour time
    hours = hours ? hours : 12; // 0 -> 12
    let minutes = date.getMinutes();
    minutes = minutes < 10 ?  '0' + minutes : minutes; // 1 -> 01 
    return `${hours}:${minutes}${hours >= 12 ? 'am' : 'pm'}`;
}

// Message tools
module.exports.errorMsg = (message, title, description) => {
    if (message.channel.type != 'dm') message.delete();
    
    const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(config.failColour);

    message.channel.send(embed)
        // Deleting response after 5 seconds
        .then(m => {
            m.delete({ timeout: 10000 })
            .catch(error => console.log(error))
        });
}

module.exports.sendWebhook = async (channel, username, content, avatarURL) => {
    const webhooks = await channel.fetchWebhooks();

    let webhook = await webhooks.find(w => w.name == channel.client.user.username);
    if (!webhook) {
        webhook = await channel.createWebhook(channel.client.user.username, channel.client.user.displayAvatarURL());
    }
    webhook.send(content, {
        'username': username,
        'avatarURL': avatarURL
    }).catch(error => console.log(error));
}

// Channel tools
module.exports.fetchModChannel = async (guild) => {
    let modChannel = await guild.channels.cache.find(channel => channel.name.toLowerCase() == guild.data.modChannelName && channel.type == 'text');
    if (!modChannel) {
        let category = await guild.channels.cache.find(channel => channel.name.toLowerCase().startsWith('mod') || channel.name.toLowerCase().startsWith('staff') && channel.type == 'category');
        if (!category) {
            modChannel = await guild.channels.create(guild.data.modChannelName, {
                type: 'text',
            });
        } else {
            modChannel = await guild.channels.create(guild.data.modChannelName, {
                type: 'text',
                parent: category
            });
        }
        await modChannel.updateOverwrite(guild.roles.everyone, {
            'VIEW_CHANNEL': false
        });
    }
    return modChannel;
}

module.exports.sortCategory = async (category) => {
    let channels = [];
    await Promise.all(category.children.map(async channel => {
        channels[channel.position] = channel.name;
    }));

    const sortedChannels = [...channels].sort();

    if (channels.join(' ') != sortedChannels.join(' ')) {
        this.log(`Sorting #${category.name}`, category.guild);
        for (let i = 0; i < sortedChannels.length; i ++) {
            const channel = await category.children.find(c => c.name == sortedChannels[i]);
            await channel.setPosition(i);
        }
    }
}