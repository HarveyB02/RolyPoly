module.exports = {
    description: 'Toggle visibility of subjects you are not enrolled in', 
    location: 'spoke', 
    cooldown: 5, 
    execute: async ({ client, message }) => {
        const bypassRole = await client.subjectTools.fetchBypassRole(message.guild);
        if (message.member.roles.cache.map(r => r.id).includes(bypassRole.id)) {
            message.member.roles.remove(bypassRole);
        } else {
            message.member.roles.add(bypassRole);
        }
        message.react('✅');
    }
}