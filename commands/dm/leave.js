const { MessageEmbed } = require("discord.js");

module.exports = {
    description:'Leave a subject',
    dmOnly: true,
    minArgs: 1,
    maxArgs: 5,
    arguments: '<subject code> {subject code}',
    execute: async ({message, args}) => {
        const subjectRegex = /^[a-z]{4}[1-4][0-9]{2}$/;

        const embed = new MessageEmbed()
            .setTitle('Leave subject')
            .setColor(0x57F278);

        const guild = await message.client.guilds.fetch(process.env.GUILD);
        const member = await guild.members.fetch(message.author.id);

        if (!member) return;

        for (var i = 0; i < args.length; i ++) {
            subjectCode = args[i];

            if (!subjectCode.match(subjectRegex)) {
                embed.addField(subjectCode.toUpperCase(), 'Invalid subject code')
                embed.setColor(0xED4245);
            } else {
                const subjectRole = await member.roles.cache.find(role => role.name.toLowerCase() == subjectCode);

                if (!subjectRole) {
                    embed.addField(subjectCode.toUpperCase(), 'You are not currently in this subject');
                    embed.setColor(0xED4245);
                } else {
                    member.roles.remove(subjectRole);
                    embed.addField(subjectCode.toUpperCase(), 'Left subject');
                }
            }
        }

        message.channel.send(embed);
    }
}