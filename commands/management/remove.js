const { MessageEmbed } = require("discord.js");

module.exports = {
    description: 'Deletes a subject channel and it\'s matching role',
    permissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    arguments: '<subject code> {subject code}',
    minArgs: 1,
    maxArgs: 10,
    cooldown: 5,
    textOnly: true,
    
    execute: async ({ message, args }) => {
        const subjectRegex = /^[a-z]{4}[1-4][0-9]{2}$/;

        const embed = new MessageEmbed()
            .setTitle('Remove subject')
            .setColor(0x57F278);
            

        for (var i = 0; i < args.length; i ++) {
            let subjectCode = args[i];

            if (!subjectCode.match(subjectRegex)) {
                embed.addField(subjectCode.toUpperCase(), 'Invalid subject code')
                embed.setColor(0xED4245);
            }

            var subjectRole = await message.guild.roles.cache.find(role => role.name.toLowerCase() == subjectCode);
            var subjectChannel = await message.guild.channels.cache.find(channel => channel.name.toLowerCase() == subjectCode);

            if (subjectRole && subjectChannel) {
                subjectRole.delete();
                subjectChannel.delete();
                embed.addField(subjectCode.toUpperCase(), 'Removed role and channel');
            } else if (subjectRole) {
                subjectRole.delete();
                embed.addField(subjectCode.toUpperCase(), 'Removed role, channel does not exist');
            } else if (subjectChannel) {
                subjectChannel.delete();
                embed.addField(subjectCode.toUpperCase(), 'Removed channel, role does not exist');
            } else {
                embed.addField(subjectCode.toUpperCase(), 'Does not exist');
                embed.setColor(0xED4245);
            }
        }

        message.reply(embed);
    }
}