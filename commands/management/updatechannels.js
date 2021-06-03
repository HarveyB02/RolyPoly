const { MessageEmbed } = require("discord.js");

module.exports = {
    description: 'Checks that all channels have the correct permission overwrights',
    permissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    maxArgs: 0,
    cooldown: 30,
    textOnly: true,
    
    execute: async ({ message, args }) => {
        const subjectCategories = await message.guild.channels.cache.filter(channel => channel.type == 'category' && channel.name.toLowerCase().replace(/[0-4]/g, '') == ' level subjects');

        subjectCategories.forEach(async category => {
            const subjectChannels = await category.children.filter(channel => channel.type == 'text');

            if (category.permissionsFor(category.guild.roles.everyone).toArray().includes('VIEW_CHANNEL')) {
                category.updateOverwrite(category.guild.roles.everyone, {
                    'VIEW_CHANNEL': false
                });
            }

            subjectChannels.forEach(async channel => {
                var subjectRole = await channel.guild.roles.cache.find(role => role.name == channel.name);

                if (!subjectRole) {
                    subjectRole = await message.guild.roles.create({
                        data: {
                            name: channel.name,
                            color: client.config.roleColour
                        }
                    });
                }

                if (!channel.permissionsFor(subjectRole).toArray().includes('VIEW_CHANNEL')) {
                    channel.updateOverwrite(subjectRole, {
                        'VIEW_CHANNEL': true
                    });
                }
            });
        });

        const embed = new MessageEmbed()
            .setTitle('Update channels')
            .setColor(0x57F278)
            .setDescription('Completed sucessfully');

        message.reply(embed);
    }
}