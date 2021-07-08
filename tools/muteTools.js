const config = require('../config');

// Mute tools
async function fetchMutedRole(guild) {
    let mutedRole = await guild.roles.cache.find(r => r.name.toLowerCase() == 'muted');
    if (!mutedRole) {
        mutedRole = await guild.roles.create({
            data: {
                name: 'Muted',
                color: config.mutedRoleColour
            }
        });
        guild.client.tools.log(`Created @${mutedRole.name}`, guild);
    }
    return mutedRole;
}
module.exports.fetchMutedRole = fetchMutedRole;

module.exports.updateMuteOverwrites = async (channel, mutedRole) => {
    var perms = await channel.permissionOverwrites.find(r => r.id == mutedRole.id)
    
    // Update voice and category channel perms
    if (channel.type == 'voice' || channel.type == 'category') {
        if (!(perms ? perms.deny.has('SPEAK') : false)) {
            await channel.updateOverwrite(mutedRole, {
                SPEAK: false
            });
            channel.client.tools.log(`Denied @${mutedRole.name} to speak in #${channel.name}`, channel.guild);
        }
    }

    // Update text and category channel perms
    if (channel.type != 'voice') {
        if (!(perms ? perms.deny.has('SEND_MESSAGES') : false)) {
            await channel.updateOverwrite(mutedRole, {
                SEND_MESSAGES: false
            });
            channel.client.tools.log(`Denied @${mutedRole.name} to type in #${channel.name}`, channel.guild);
        }
    }
}