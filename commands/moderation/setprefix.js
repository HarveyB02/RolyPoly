module.exports = {
    description: 'Change bot prefix',
    permissions: ['ADMINISTRATOR'],
    textOnly: true,
    minArgs: 1,
    maxArgs: 1,
    arguments: '<prefix>',
    cooldown: 5,
    execute: async ({ message, args, data }) => {
        // Updating prefix in cache
        data.guild.prefix = args[0];
        message.guild.prefix = args[0];
        // Updating prefix in database
        await data.guild.save();
        message.react('✅');
    }
}