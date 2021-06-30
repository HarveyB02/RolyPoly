module.exports = {
    description: 'Send a message to all staff channels',
    dmOnly: true,
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
        }));
    }
}