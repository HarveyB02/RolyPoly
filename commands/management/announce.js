module.exports = {
    description: 'Send an announcement to all alert channels on spoke servers',
    location: 'dm',
    ownerOnly: true,
    minArgs: 1,
    arguments: '<message content>',
    cooldown: 5,
    execute: async ({ client, message, args }) => {
        await Promise.all(client.guilds.cache.map(async guild => {
            if (!guild.data) {
                guild.data = await client.database.fetchGuild(guild);
            }
            const modChannel = await message.client.tools.fetchModChannel(guild);
            modChannel.send(args.join(' '));
            message.attachments.map(async attachment => {
                modChannel.send(attachment.url);
            });
            message.channel.send(`Messaged ${guild.name} > #${modChannel.name}`);
        }));
    }
}