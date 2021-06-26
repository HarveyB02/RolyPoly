const { MessageEmbed } = require("discord.js");

module.exports = {
    description: 'Checks that all channels have the correct permission overwrights',
    permissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    maxArgs: 0,
    cooldown: 30,
    textOnly: true,
    
    execute: async ({ client, message, args }) => {
        var categories = '';
        var channels = '';
        var roles = '';

        const subjectCategories = await message.guild.channels.cache.filter(channel => channel.type == 'category' && channel.name.toLowerCase().replace(/[0-4]/g, '') == ' level subjects');

        await Promise.all(subjectCategories.map(async category => {
            const subjectChannels = await category.children.filter(channel => channel.type == 'text');

            if (category.permissionsFor(category.guild.roles.everyone).toArray().includes('VIEW_CHANNEL')) {
                await category.updateOverwrite(category.guild.roles.everyone, {
                    'VIEW_CHANNEL': false
                });

                categories += `${category.name}, `;
            }

            await Promise.all(subjectChannels.map(async channel => {
                var subjectRole = await channel.guild.roles.cache.find(role => role.name == channel.name);

                if (!subjectRole) {
                    subjectRole = await message.guild.roles.create({
                        data: {
                            name: channel.name,
                            color: client.config.roleColour
                        }
                    });
                    
                    roles += `<@&${subjectRole.id}>, `;
                }

                if (!channel.permissionsFor(subjectRole).toArray().includes('VIEW_CHANNEL')) {
                    channel.updateOverwrite(subjectRole, {
                        'VIEW_CHANNEL': true
                    });
                    channels += `<#${channel.id}>, `;
                }
            }));
        }));

        const embed = new MessageEmbed()
            .setTitle('Check Results')
            .setColor(0x57F278);

        if (categories) {
            embed.addField('Updated Categories', categories.substring(0, categories.length - 2));
        }

        if (channels) {
            embed.addField('Updated Channels', channels.substring(0, channels.length - 2));
        }

        if (roles) {
            embed.addField('Updated Roles', roles.substring(0, roles.length - 2));
        }

        if (!categories && !channels && !roles) {
            embed.setDescription('All overwrites are set');
        }

        message.reply(embed);
    }
}