const { MessageEmbed } = require("discord.js");
const config = require('../../config.json');

module.exports = {
    description: 'Adds a new subject code to the server. Up to 10 subjects can be added at once',
    permissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    arguments: '<subject code> {subject code}',
    minArgs: 1,
    maxArgs: 10,
    cooldown: 5,
    location: 'text',
    
    execute: async ({ client, message, args }) => {
        // Create response embed
        const embed = new MessageEmbed()
            .setColor(config.successColour);

        // Loop through subject codes
        for (var i = 0; i < args.length; i ++) {
            let subjectCode = args[i];

            // Check if code is valid
            if (!subjectCode.match(client.subjectRegex)) {
                embed.addField(subjectCode.toUpperCase(), 'Invalid subject code');
                embed.setColor(config.failColour);
                continue;
            }

            // Check if subject already exists
            var subjectRole = await message.guild.roles.cache.find(role => role.name.toLowerCase() == subjectCode);
            var subjectChannel = await message.guild.channels.cache.find(channel => channel.name.toLowerCase() == subjectCode && channel.type == 'text');
            if (subjectRole && subjectChannel) {
                embed.addField(subjectCode.toUpperCase(), 'Subject already exists');
                embed.setColor(config.failColour);
            } else {
                client.subjectTools.createSubject(message.guild, subjectCode);
                embed.addField(subjectCode.toUpperCase(), 'Successfully added');
            }
        }

        message.reply(embed);
    }
}