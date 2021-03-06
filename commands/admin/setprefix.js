module.exports = {
    description: 'Change the prefix used on this server',
    permissions: ['MANAGE_GUILD'],
    location: 'text',
    minArgs: 1,
    arguments: '<prefix>',
    cooldown: 5,
    execute: async ({ client, message, args }) => {
        const oldPrefix = message.guild.data.prefix;
        message.guild.data.prefix = args[0];
        await message.guild.data.save();
        message.react('✅');
        client.tools.log(`Changed prefix from ${oldPrefix} to ${args[0]}`, message.guild);
    }
}