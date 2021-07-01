module.exports = {
    description: 'Unban a user',
    location: 'text',
    permissions: ['BAN_MEMBERS'],
    minArgs: 1,
    maxArgs: 1,
    arguments: '<user tag or ID>',
    cooldown: 5,
    execute: async ({ client, message, args }) => {
        const bans = await message.guild.fetchBans();
        const ban = bans.find(b => b.user.id == args[0] || b.user.tag == args[0]);
        if (!ban) {
            client.tools.errorMsg(message, 'User is not banned', 'Could not find a banned user with this tag or ID');
            return;
        }

        const fakeMember = {
            id: ban.user.id,
            guild: {
                id: message.guild.id
            }
        }
        // Clean database
        client.database.removeBan(fakeMember);

        // Unbanning user
        await message.guild.members.unban(ban.user);

        // Confirmation
        message.react('✅');
        client.tools.log(`Unbanned @${ban.user.username}#${ban.user.discriminator}`, message.guild);
    }
}