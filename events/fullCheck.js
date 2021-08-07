module.exports = {
    execute: async (client) => {
        // Looping through all guilds
        const guilds = await client.guilds.cache.map(g => g);
        for (let i = 0; i < guilds.length; i ++) {
            const guild = guilds[i];
            await guild.roles.fetch();
            const mutedRole = await client.muteTools.fetchMutedRole(guild);

            if (guild.id == client.config.hubID) {
                // Looping through all channels
                let channels = await guild.channels.cache.map(c => c);
                for (let j = 0; j < channels.length; j ++) {
                    const channel = channels[j];
                    await client.muteTools.updateMuteOverwrites(channel, mutedRole);
                }
            } else {
                //let cSubjects = []; // Array of subjects from channel names
                
                // Looping through all channels
                let channels = await guild.channels.cache.map(c => c);
                for (let j = 0; j < channels.length; j ++) {
                    const channel = channels[j];
                    
                    await client.subjectTools.updateSubjectOverwrites(channel);
                    await client.muteTools.updateMuteOverwrites(channel, mutedRole);

                    /*if (channel.name.match(client.subjectRegex)) {
                        cSubjects[cSubjects.length] = channel.name.toLowerCase();
                    }*/
                }

                /*let rSubjects = []; // Array of subjects from role names
                await Promise.all(guild.roles.cache.map(async role => {
                    if (role.name.toLowerCase().match(client.subjectRegex)) {
                        if (role.name.toUpperCase() != role.name) {
                            role.setName(role.name.toUpperCase());
                            client.tools.log(`Made @${role.name} uppercase`, guild);
                        }
                        rSubjects[rSubjects.length] = role.name.toLowerCase();
                    }
                }));

                // Fixing half subjects
                let missingChannels = rSubjects.filter(e => !cSubjects.includes(e));
                await Promise.all(missingChannels.map(async subjectCode => {
                    client.subjectTools.createSubject(guild, subjectCode);
                }));*/
            }
        }
    }
}