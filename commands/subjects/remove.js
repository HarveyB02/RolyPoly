const { MessageEmbed } = require("discord.js");
const config = require('../../config.json');

module.exports = {
    description: 'Deletes a subject channel and it\'s matching role',
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
                embed.addField(subjectCode.toUpperCase(), 'Invalid subject code')
                embed.setColor(config.failColour);
                continue;
            }

            // Removing subject channel / role
            var subjectRole = await message.guild.roles.cache.find(role => role.name.toLowerCase() == subjectCode);
            var subjectChannel = await message.guild.channels.cache.find(channel => channel.name.toLowerCase() == subjectCode);
            if (subjectRole) {
                subjectRole.delete();
                client.tools.log(`Deleted @${subjectRole.name}`, message.guild);
            }
            if (subjectChannel) {
                subjectChannel.delete();
                client.tools.log(`Deleted #${subjectChannel.name}`, message.guild);
            }
            
            // Creating response
            if (subjectRole && subjectChannel) {
                embed.addField(subjectCode.toUpperCase(), 'Removed role and channel');
            } else if (subjectRole) {
                embed.addField(subjectCode.toUpperCase(), 'Removed role, channel does not exist');
            } else if (subjectChannel) {
                embed.addField(subjectCode.toUpperCase(), 'Removed channel, role does not exist');
            } else {
                embed.addField(subjectCode.toUpperCase(), 'Does not exist');
                embed.setColor(config.failColour);
            }
        }

        message.reply(embed);
    }
}