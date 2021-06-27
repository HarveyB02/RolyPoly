const { MessageEmbed } = require("discord.js");

module.exports = {
    description: 'Creates a new subject channel and matching role',
    permissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    arguments: '<subject code> {subject code}',
    minArgs: 1,
    maxArgs: 10,
    cooldown: 5,
    textOnly: true,
    
    execute: async ({ client, message, args }) => {
        const subjectRegex = /^[a-z]{4}[1-4][0-9]{2}$/;

        const embed = new MessageEmbed()
            .setColor(0x57F278);
            

        for (var i = 0; i < args.length; i ++) {
            let subjectCode = args[i];

            if (!subjectCode.match(subjectRegex)) {
                embed.addField(subjectCode.toUpperCase(), 'Invalid subject code')
                embed.setColor(0xED4245);
                continue;
            }

            if (message.guild.roles.cache.find(role => role.name.toLowerCase() == subjectCode) ||
                message.guild.channels.cache.find(channel => channel.name.toLowerCase() == subjectCode && channel.type == 'text')) {
                    embed.addField(subjectCode.toUpperCase(), 'Subject already exists')
                    embed.setColor(0xED4245);
            } else {
                client.tools.createSubject(message.guild, subjectCode);

                embed.addField(subjectCode.toUpperCase(), 'Successfully added')
            }
        }

        message.reply(embed);
    }
}