const { MessageEmbed } = require("discord.js");
const config = require('../../config.json');
const guild = require("../../database/Schema/guild");

module.exports = {
    description:'Assigns you the role for a subject',
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
            let subjectCode = args[i].toLowerCase();

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