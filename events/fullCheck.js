module.exports = {
    execute: async (client) => {
        // Looping through all guilds
        await Promise.all(client.guilds.cache.map(async guild => {
            if (guild.id == client.config.hubID) {

                var mutedRole = await client.muteTools.fetchMutedRole(guild);
                // Looping through all channels
                await Promise.all(guild.channels.cache.map(async channel => {
                    await client.muteTools.updateMuteOverwrites(channel, mutedRole);
                }));

            } else {

                var cSubjects = []; // Array of subjects from channel names
                var mutedRole = await client.muteTools.fetchMutedRole(guild);

                // Looping through all channels
                await Promise.all(guild.channels.cache.map(async channel => {

                    await client.subjectTools.updateSubjectOverwrites(channel);

                    await client.muteTools.updateMuteOverwrites(channel, mutedRole);

                    if (channel.name.match(client.subjectRegex)) {
                        cSubjects[cSubjects.length] = channel.name;
                    }
                }));

                var rSubjects = []; // Array of subjects from role names
                await Promise.all(guild.roles.cache.map(async role => {
                    if (role.name.toLowerCase().match(client.subjectRegex)) {
                        rSubjects[rSubjects.length] = role.name;
                    }
                }));

                // Fixing half subjects
                var missingChannels = rSubjects.filter(e => !cSubjects.includes(e));
                await Promise.all(missingChannels.map(async subjectCode => {
                    client.subjectTools.createSubject(guild, subjectCode);
                }));
            }
        }));
    }
}