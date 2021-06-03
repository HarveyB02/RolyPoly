const { MessageEmbed } = require("discord.js");

module.exports = {
    description: 'Leave all the subjects you have joined',
    dmOnly: false,
    execute: async ({message}) => {
        const subjectRegex = /^[a-z]{4}[1-4][0-9]{2}$/;

        const embed = new MessageEmbed()
        .setTitle('Leave subject')

        const guild = await message.client.guilds.fetch(process.env.GUILD);
        const member = await guild.members.fetch(message.author.id);

        if (!member) return;

        const subjectRoles = member.roles.cache.filter(role => role.name.toLowerCase().match(subjectRegex));

        if (subjectRoles.size == 0) {
            embed.setDescription('You have not joined any subjects');
            embed.setColor(0xED4245);
        } else {
            var subjectNames = '';

            subjectRoles.forEach(role => {
                subjectNames += role.name + ', '
                member.roles.remove(role)
            });

            embed.setDescription(`Left: ${subjectNames.substring(0, subjectNames.length - 2)}`)
            .setColor(0x57F278);
        }

        message.reply(embed);
    }
}