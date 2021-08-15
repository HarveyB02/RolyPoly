const { MessageEmbed } = require("discord.js");
const config = require('../../config.json');

module.exports = {
    description:'Assigns you the role for a subject or course',
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
            let courseRole = await message.guild.roles.cache.find(r => r.name.toLowerCase() == courseName.toLowerCase());

            if (!courseRole) {
                let index = message.guild.data.courses.indexOf(courseName);
                message.guild.data.courses.splice(index, 1);
                message.guild.data.markModified('courses'); 
                await message.guild.data.save();
                client.tools.log(`could not find role for ${courseName}, removed from the course list`, message.guild);
            } else {
                message.member.roles.add(courseRole);
                embed.addField(courseName.toUpperCase(), 'Applied course role');
                message.channel.send(embed);
                return;
            }
        }

        // Loop through subject codes
        for (let i = 0; i < args.length && i < 5; i ++) {
            let subjectCode = args[i].toLowerCase().replace(',', '');

            // If course role
            if (message.guild.data.courses.includes(subjectCode)) {
                let courseRole = await message.guild.roles.cache.find(r => r.name.toLowerCase() == subjectCode);

                if (!courseRole) {
                    let index = message.guild.data.courses.indexOf(subjectCode);
                    message.guild.data.courses.splice(index, 1);
                    message.guild.data.markModified('courses'); 
                    await message.guild.data.save();
                    client.tools.log(`could not find role for ${subjectCode}, removed from the course list`, message.guild);

                    embed.addField(subjectCode.toUpperCase(), 'Invalid subject code');
                    embed.setColor(config.failColour);
                } else {
                    message.member.roles.add(courseRole);
                    embed.addField(subjectCode.toUpperCase(), 'Applied course role');
                }

                continue;
            }

            // Check if code is valid
            if (!subjectCode.match(client.subjectRegex)) {
                embed.addField(subjectCode.toUpperCase(), 'Invalid subject code');
                embed.setColor(config.failColour);
                continue;
            }

            // Check if already joined
            if (message.member.roles.cache.find(role => role.name.toLowerCase() == subjectCode)) {
                embed.addField(subjectCode.toUpperCase(), 'You have already joined');
                embed.setColor(config.failColour);
                continue;
            } 
        
            // Check if subject exists
            const subjectRole = await message.guild.roles.cache.find(role => role.name.toLowerCase() == subjectCode);
            const subjectChannel = await message.guild.channels.cache.find(channel => channel.name.toLowerCase() == subjectCode);
            if (subjectRole || subjectChannel) {
                // Adding member to subject
                if (!subjectRole || !subjectChannel) {
                    await client.subjectTools.createSubject(message.guild, subjectCode, message.member);
                } else {
                    message.member.roles.add(subjectRole);
                }
                embed.addField(subjectCode.toUpperCase(), 'Sucessfully joined');
                continue;
            }

            const modChannel = await message.client.tools.fetchModChannel(message.guild);

            // Sending request embed
            const requestEmbed = new MessageEmbed()
                .setTitle('Subject Approval Request')
                .setColor(config.successColour)
                .addField('User', `<@${message.author.id}>`, true)
                .addField('Subject', subjectCode.toUpperCase(), true);

            const requestMsg = await modChannel.send(requestEmbed);
            requestMsg.react('✅');
            requestMsg.react('❌');

            embed.addField(subjectCode.toUpperCase(), 'We don\'t currently have a channel for this subject, I\'ve contacted the moderators if one should be created. You\'ll receive a DM when a choice is made');
        }
        message.channel.send(embed);
    }
}