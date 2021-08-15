const { MessageEmbed } = require("discord.js");
const config = require('../../config.json');

module.exports = {
    description:'Removes a subject or course role',
    location: 'spoke',
    minArgs: 1,
    arguments: '<subject code> {subject code}',
    cooldown: 5,
    execute: async ({ client, message, args }) => {
        // Create response embed
        const embed = new MessageEmbed()
            .setColor(config.successColour);

        let courseName = args.join(' ');
        if (message.guild.data.courses.includes(courseName)) {
            let courseRole = await message.member.roles.cache.find(r => r.name.toLowerCase() == courseName);

            if (!courseRole) {
                embed.addField(courseName.toUpperCase(), 'You have not selected this course role');
                embed.setColor(config.failColour);
            } else {
                message.member.roles.remove(courseRole);
                embed.addField(courseName.toUpperCase(), 'Left course');
            }
            message.channel.send(embed);
            return;
        }

        // Loop through subject codes
        for (let i = 0; i < args.length && i < 5; i ++) {
            subjectCode = args[i].toLowerCase().replace(',', '');

            // If course role
            if (message.guild.data.courses.includes(subjectCode)) {
                let courseRole = await message.member.roles.cache.find(r => r.name.toLowerCase() == subjectCode);

                if (!courseRole) {
                    embed.addField(subjectCode.toUpperCase(), 'You have not selected this course role');
                    embed.setColor(config.failColour);
                } else {
                    message.member.roles.remove(courseRole);
                    embed.addField(subjectCode.toUpperCase(), 'Left course');
                }

                continue;
            }

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