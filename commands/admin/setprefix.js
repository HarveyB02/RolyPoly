module.exports = {
    description: 'Change bot prefix',
    permissions: ['ADMINISTRATOR'],
    textOnly: true,
    minArgs: 1,
    maxArgs: 1,
    arguments: '<prefix>',
    cooldown: 5,
    execute: async ({ client, message, args, data }) => {
        data.guild.prefix = args[0];
        message.guild.prefix = args[0];
        await data.guild.save();
    }
}