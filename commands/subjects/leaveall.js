const { MessageEmbed } = require("discord.js");

module.exports = {
    description: 'Leave all the subjects you have joined',
    dmOnly: false,
    cooldown: 10,
    execute: async ({message}) => {
        const subjectRegex = /^[a-z]{4}[1-4][0-9]{2}$/;

        const subjectRoles = message.member.roles.cache.filter(role => role.name.toLowerCase().match(subjectRegex));

        const embed = new MessageEmbed()
        if (subjectRoles.size == 1) {
            embed.setTitle('Left 1 Subject');
        } else {
            embed.setTitle(`Left ${subjectRoles.size} Subjects`);
        }

        if (subjectRoles.size == 0) {
            embed.setDescription('You do not have any subject roles');
            embed.setColor(0xED4245);
        } else {
            var subjectNames = '';

            subjectRoles.forEach(role => {
                subjectNames += role.name + ', '
                message.member.roles.remove(role)
            });

            embed.setDescription(subjectNames.substring(0, subjectNames.length - 2))
            .setColor(0x57F278);
        }

        message.reply(embed);
    }
}