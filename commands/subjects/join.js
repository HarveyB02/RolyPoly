const { MessageEmbed } = require("discord.js");

module.exports = {
    description:'Join a subject to unlock the subject channel and recieve relevant notifications',
    textOnly: true,
    minArgs: 1,
    maxArgs: 5,
    arguments: '<subject code> {subject code}',
    cooldown: 10,
    execute: async ({message, args}) => {
        const subjectRegex = /^[a-z]{4}[1-4][0-9]{2}$/;

        const embed = new MessageEmbed()
            .setColor(0x57F278);

        for (var i = 0; i < args.length; i ++) {
            subjectCode = args[i];

            if (!subjectCode.match(subjectRegex)) {
                embed.addField(subjectCode.toUpperCase(), 'Invalid subject code')
                embed.setColor(0xED4245);
            }

            else if (message.member.roles.cache.find(role => role.name.toLowerCase() == subjectCode)) {
                embed.addField(subjectCode.toUpperCase(), 'You have already joined')
                embed.setColor(0xED4245);
            } else {
                const subjectRole = await message.guild.roles.cache.find(role => role.name.toLowerCase() == subjectCode);

                if (subjectRole) {
                    message.member.roles.add(subjectRole);
                    embed.addField(subjectCode.toUpperCase(), 'Sucessfully joined')
                } else {
                    var modChannel = await message.guild.channels.cache.find(channel => channel.name.toLowerCase() == 'subject-requests' && channel.type == 'text');

                    if (!modChannel) {
                        var category = await message.guild.channels.cache.find(channel => channel.name.toLowerCase().startsWith('moderator') && channel.type == 'category');
                        
                        if (!category) {
                            modChannel = await message.guild.channels.create('subject-requests', {
                                type: 'text',
                            });

                            await modChannel.updateOverwrite(message.guild.roles.everyone, {
                                'VIEW_CHANNEL': false
                            });
                        } else {
                            modChannel = await message.guild.channels.create('subject-requests', {
                                type: 'text',
                                parent: category
                            });
                        }
                    }

                    const requestEmbed = new MessageEmbed()
                        .setTitle('Subject Approval Request')
                        .setColor(0x57F278)
                        .addField('User', `<@${message.author.id}>`, true)
                        .addField('Subject', subjectCode.toUpperCase(), true);

                    const requestMsg = await modChannel.send(requestEmbed);
                    requestMsg.react('✅');
                    requestMsg.react('❌');

                    embed.addField(subjectCode.toUpperCase(), 'We don\'t currently have a channel for this subject, I\'ve contacted the moderators if one should be created. You\'ll receive a DM when a choice is made');
                }
            }
        }

        message.channel.send(embed);
    }
}