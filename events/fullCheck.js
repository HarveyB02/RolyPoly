module.exports = {
    execute: async (client) => {
        // Looping through all guilds
        const guilds = await client.guilds.cache.map(g => g);
        for (var i = 0; i < guilds.length; i ++) {
            const guild = guilds[i];
            const mutedRole = await client.muteTools.fetchMutedRole(guild);

            if (guild.id == client.config.hubID) {
                // Looping through all channels
                var channels = await guild.channels.cache.map(c => c);
                for (var j = 0; j < channels.length; j ++) {
                    const channel = channels[j];
                    await client.muteTools.updateMuteOverwrites(channel, mutedRole);
                }
            } else {
                var cSubjects = []; // Array of subjects from channel names
                
                // Looping through all channels
                var channels = await guild.channels.cache.map(c => c);
                for (var j = 0; j < channels.length; j ++) {
                    const channel = channels[j];
                    
                    await client.subjectTools.updateSubjectOverwrites(channel);
                    await client.muteTools.updateMuteOverwrites(channel, mutedRole);

                    if (channel.name.match(client.subjectRegex)) {
                        cSubjects[cSubjects.length] = channel.name;
                    }
                }

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
        }
    }
}