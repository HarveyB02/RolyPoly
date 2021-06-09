const { MessageEmbed } = require("discord.js");

module.exports = {
    execute: async (reaction, user, client) => {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.log(error);
                return;
            }
        }

        if (reaction.message.author.id != client.user.id) return;
        if (reaction.message.embeds[0].title != 'Subject Approval Request') return;
        if (reaction.count != 2) return;

        var subjectCode = reaction.message.embeds[0].fields[1].value.toLowerCase();
        var memberID = reaction.message.embeds[0].fields[0].value;
        memberID = memberID.substring(2, memberID.length - 1);

        const guild = await reaction.message.client.guilds.fetch(process.env.GUILD);
        const member = await guild.members.fetch(memberID);
        
        if (!member) return;

        if (reaction.emoji.name == '✅') {
            reaction.message.delete();
            
            var subjectRole = await guild.roles.cache.find(role => role.name.toLowerCase() == subjectCode);
            var subjectChannel = await guild.roles.cache.find(channel => channel.name.toLowerCase() == subjectCode);

            if (!subjectRole) {
                subjectRole = await guild.roles.create({
                    data: {
                        name: subjectCode.toUpperCase(),
                        color: client.config.roleColour
                    }
                });
            }

            if (!subjectChannel) {
                var subjectLvl = subjectCode.match(/\d/) + '00 level subjects'

                var parent = await reaction.message.guild.channels.cache.find(channel => channel.name.toLowerCase() == subjectLvl && channel.type == 'category');

                if (!parent) {
                    parent = await reaction.message.guild.channels.create(subjectLvl, {
                        type: 'category'
                    });

                    parent.updateOverwrite(message.guild.roles.everyone, {
                        'VIEW_CHANNEL': false
                    });
                }

                subjectChannel = await reaction.message.guild.channels.create(subjectCode, {
                    type: 'text',
                    parent: parent
                });

                subjectChannel.updateOverwrite(subjectRole, {
                    'VIEW_CHANNEL': true
                });
            }

            member.roles.add(subjectRole);

            const embed = new MessageEmbed()
                .setTitle(`${subjectCode.toUpperCase()} Subject Request`)
                .setDescription(`Your request to add the subject **${subjectCode.toUpperCase()}** has been approved. There is now a dedicated channel and role which you have been assigned`)
                .setColor(0x57F278);

            member.send(embed);

        } else if (reaction.emoji.name == '❌') {
            reaction.message.delete();

            const embed = new MessageEmbed()
                .setTitle(`${subjectCode.toUpperCase()} Subject Request`)
                .setDescription(`Your request to create the subject channel **${subjectCode.toUpperCase()}** has been denied. This is most likely because the subject you requested is not a real UOW CSIT subject.`)
                .setFooter('If you believe this is a mistake, please contact a moderator')
                .setColor(0xED4245);

            member.send(embed);
        }
    }
}