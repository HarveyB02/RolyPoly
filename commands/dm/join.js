const { MessageEmbed } = require("discord.js");

module.exports = {
    description:'Join a subject to unlock the subject channel and recieve relevant notifications',
    dmOnly: true,
    minArgs: 1,
    maxArgs: 5,
    arguments: '<subject code> {subject code}',
    cooldown: 10,
    execute: async ({message, args}) => {
        const subjectRegex = /^[a-z]{4}[1-4][0-9]{2}$/;

        const embed = new MessageEmbed()
            .setTitle('Join subject')
            .setColor(0x57F278);

        const guild = await message.client.guilds.fetch(process.env.GUILD);
        const member = await guild.members.fetch(message.author.id);

        if (!member) return;

        for (var i = 0; i < args.length; i ++) {
            subjectCode = args[i];

            if (!subjectCode.match(subjectRegex)) {
                embed.addField(subjectCode.toUpperCase(), 'Invalid subject code')
                embed.setColor(0xED4245);
            }

            else if (member.roles.cache.find(role => role.name.toLowerCase() == subjectCode)) {
                embed.addField(subjectCode.toUpperCase(), 'You have already joined')
                embed.setColor(0xED4245);
            } else {
                const subjectRole = await guild.roles.cache.find(role => role.name.toLowerCase() == subjectCode);

                if (subjectRole) {
                    member.roles.add(subjectRole);
                    embed.addField(subjectCode.toUpperCase(), 'Sucessfully joined')
                } else {
                    var modChannel = await guild.channels.cache.find(channel => channel.name.toLowerCase() == 'subject-requests' && channel.type == 'text');

                    if (!modChannel) {
                        var category = await guild.channels.cache.find(channel => channel.name.toLowerCase().startsWith('moderator') && channel.type == 'category');
                        
                        if (!category) {
                            modChannel = await guild.channels.create('subject-requests', {
                                type: 'text',
                            });

                            await modChannel.updateOverwrite(guild.roles.everyone, {
                                'VIEW_CHANNEL': false
                            });
                        } else {
                            modChannel = await guild.channels.create('subject-requests', {
                                type: 'text',
                                parent: category
                            });
                        }
                    }

                    const requestMsg = await modChannel.send('**Subject Approval request**\nUser: <@' + message.author.id + '>\nSubject: ' + subjectCode.toUpperCase());
                    requestMsg.react('✅');
                    requestMsg.react('❌');

                    embed.addField(subjectCode.toUpperCase(), 'Subject channel currently doesn\'t exist, moderaters are reviewing your request to create one');
                }
            }
        }

        message.channel.send(embed);
    }
}