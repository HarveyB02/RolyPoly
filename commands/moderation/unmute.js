module.exports = {
    description: 'Unmute a user',
    textOnly: true,
    permissions: ['MANAGE_ROLES'],
    minArgs: 1,
    maxArgs: 1,
    arguments: '<user>~member',
    cooldown: 5,
    execute: async ({ client, message, args }) => {
        var isMuted = await client.database.isMuted(client, args[0].id, message.guild.id);
        if (isMuted) {
            var mutedRole = await client.muteTools.fetchMutedRole(message.guild);
            client.database.removeMute(args[0].id, message.guild.id);
            args[0].roles.remove(mutedRole);
            client.tools.log(`Unmuted @${message.author.tag}`, message.guild);
            message.react('✅');
        } else {
            client.tools.errorMsg(message, 'User is not muted', `<@!${args[0].id}> is not currently muted`)
        }
    }
}