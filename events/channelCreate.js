module.exports = {
    execute: async (channel, client) => {
        if (channel.type == 'dm') return;
        var mutedRole = await client.muteTools.fetchMutedRole(channel.guild);
        await client.muteTools.updateMuteOverwrites(channel, mutedRole);
        await client.subjectTools.updateSubjectOverwrites(channel);
        if (channel.parent) {
            await client.muteTools.updateMuteOverwrites(channel.parent, mutedRole);
            await client.tools.sortCategory(channel.parent);
        }
    }
}