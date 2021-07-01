module.exports = {
    description: 'Specify which channel alerts should be sent to. This will make the channel private',
    permissions: ['MANAGE_GUILD'],
    location: 'spoke',
    minArgs: 1,
    maxArgs: 1,
    arguments: '<channel>~channel',
    cooldown: 5,
    execute: async ({ client, message, args }) => {
        // Deny everyone to view channel
        const channel = args[0];
        if (channel.permissionsFor(channel.guild.roles.everyone).toArray().includes('VIEW_CHANNEL')) {
            await channel.updateOverwrite(channel.guild.roles.everyone, {
                'VIEW_CHANNEL': false
            });
            client.tools.log(`Denied @everyone to view #${channel.name}`, channel.guild);
        }

        const oldChannel = message.guild.data.modChannelName;

        // Update data
        message.guild.data.modChannelName = channel.name;
        await message.guild.data.save();
        message.react('✅');
        client.tools.log(`Changed mod channel from #${oldChannel} to #${channel.name}`, channel.guild);
    }
}