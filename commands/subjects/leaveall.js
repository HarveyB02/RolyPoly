const { MessageEmbed } = require("discord.js");
const config = require('../../config.json');

module.exports = {
    description: 'Leave all the subjects you have joined',
    textOnly: true,
    cooldown: 10,
    execute: async ({ client, message }) => {
        // Get subjects member has joined
        const subjectRoles = message.member.roles.cache.filter(role => role.name.toLowerCase().match(client.subjectRegex));

        // Create response embed
        const embed = new MessageEmbed()
        if (subjectRoles.size == 1) {
            embed.setTitle('Left 1 Subject');
        } else {
            embed.setTitle(`Left ${subjectRoles.size} Subjects`);
        }

        // Check if joined any subjects
        if (subjectRoles.size == 0) {
            embed.setDescription('You do not have any subject roles');
            embed.setColor(config.failColour);
        } else {
            var subjectNames = '';

            // Leave all subject roles
            subjectRoles.forEach(role => {
                subjectNames += role.name + ', '
                message.member.roles.remove(role)
            });

            embed.setDescription(subjectNames.substring(0, subjectNames.length - 2))
            embed.setColor(config.successColour);
        }
        message.reply(embed);
    }
}