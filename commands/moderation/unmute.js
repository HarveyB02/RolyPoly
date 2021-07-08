module.exports = {
    description: 'Unmute a user',
    location: 'text',
    permissions: ['MANAGE_ROLES'],
    minArgs: 1,
    arguments: '<user>~member',
    cooldown: 5,
    execute: async ({ client, message, args }) => {
        let isMuted = await client.database.isMuted(args[0]);
        if (isMuted) {
            let mutedRole = await client.muteTools.fetchMutedRole(message.guild);
            client.database.removeMute(args[0]);
            args[0].roles.remove(mutedRole);
            client.tools.log(`Unmuted @${message.author.tag}`, message.guild);
            message.react('✅');
        } else {
            client.tools.errorMsg(message, 'User is not muted', `<@!${args[0].id}> is not currently muted`)
        }
    }
}