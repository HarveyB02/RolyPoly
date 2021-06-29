module.exports = {
    execute: async (channel, client) => {
        var mutedRole = await client.muteTools.fetchMutedRole(channel.guild);
        client.muteTools.updateMuteOverwrites(channel, mutedRole);
        if (channel.parent) {
            client.muteTools.updateMuteOverwrites(channel.parent, mutedRole);
        }
    }
}