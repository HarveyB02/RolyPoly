const { MessageEmbed } = require("discord.js");
const config = require('../../config.json');

module.exports = {
    description:'Removes a subject role',
    location: 'spoke',
    minArgs: 1,
    maxArgs: 5,
    arguments: '<subject code> {subject code}',
    cooldown: 5,
    execute: async ({ client, message, args }) => {
        // Create response embed
        const embed = new MessageEmbed()
            .setColor(config.successColour);

        // Loop through subject codes
        for (let i = 0; i < args.length; i ++) {
            subjectCode = args[i].toLowerCase();

            // Check if code is valid
            if (!subjectCode.match(client.subjectRegex)) {
                embed.addField(subjectCode.toUpperCase(), 'Invalid subject code');
                embed.setColor(config.failColour);
                continue;
            }

            // Check if joined
            const subjectRole = await message.member.roles.cache.find(role => role.name.toLowerCase() == subjectCode);
            if (!subjectRole) {
                embed.addField(subjectCode.toUpperCase(), 'You are not currently in this subject');
                embed.setColor(config.failColour);
            } else {
                message.member.roles.remove(subjectRole);
                embed.addField(subjectCode.toUpperCase(), 'Left subject');
            }
        }

        message.channel.send(embed);
    }
}