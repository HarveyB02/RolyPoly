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

module.exports.createSubject = async (guild, subjectCode, member) => {
    var subjectRole = await guild.roles.cache.find(role => role.name.toLowerCase() == subjectCode.toLowerCase());
    var subjectChannel = await guild.channels.cache.find(channel => channel.name.toLowerCase() == subjectCode.toLowerCase());
    if (!subjectRole) {
        if (!guild.roleColour) {
            var guildData = await client.Database.fetchGuild(guild.id);
            guild.roleColour = guildData.roleColour;
        }
        subjectRole = await guild.roles.create({
            data: {
                name: subjectCode.toUpperCase(),
                color: guild.roleColour
            }
        });
        console.log(`Created @${subjectRole.name}`);
        if (subjectChannel) {
            subjectChannel.updateOverwrite(subjectRole, {
                'VIEW_CHANNEL': true
            });
            console.log(`Allowed @${subjectRole.name} to view #${subjectChannel.name}`);
        }
    }
    
    if (!subjectChannel) {
        var mutedRole = await guild.roles.cache.find(r => r.name.toLowerCase() == 'muted');
        var subjectLvl = subjectCode.match(/\d/) + '00 level subjects'

        var parent = await guild.channels.cache.find(channel => channel.name.toLowerCase() == subjectLvl && channel.type == 'category');
        if (!parent) {
            parent = await guild.channels.create(subjectLvl, {
                type: 'category'
            });
            console.log(`Created #${parent.name}`);
            parent.updateOverwrite(guild.roles.everyone, {
                'VIEW_CHANNEL': false
            });
            console.log(`Denied @everyone to view #${parent.name}`);
            parent.updateOverwrite(mutedRole, {
                'SEND_MESSAGES': false
            });
            console.log(`Denied @${mutedRole.name} to type in #${parent.name}`);
        }

        subjectChannel = await guild.channels.create(subjectCode, {
            type: 'text',
            parent: parent
        });
        console.log(`Created #${subjectChannel.name}`);
        subjectChannel.updateOverwrite(subjectRole, {
            'VIEW_CHANNEL': true
        });
        console.log(`Allowed @${subjectRole.name} to view #${subjectChannel.name}`);
        subjectChannel.updateOverwrite(mutedRole, {
            'SEND_MESSAGES': false
        });
        console.log(`Denied @${mutedRole.name} to type in #${subjectChannel.name}`);
    }

    if (member) {
        member.roles.add(subjectRole);
    }
}