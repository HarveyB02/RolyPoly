module.exports = {
    description: 'Unmute a user',
    textOnly: true,
    permissions: ['MANAGE_ROLES'],
    minArgs: 1,
    maxArgs: 1,
    arguments: '<user>~member',
    cooldown: 5,
    execute: async ({ client, message, args }) => {
        // todo
    }
}