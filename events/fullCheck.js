const { Collection } = require("discord.js");

module.exports = {
    execute: async (client) => {
        await checkMissingChannels(client);
        await checkSubjectOverwrites(client);
        await checkMuteOverwrites(client);
    }
}

async function checkMissingChannels(client) {
    const subjectRegex = /^[a-z]{4}[1-4][0-9]{2}$/;

    await Promise.all(client.guilds.cache.map(async guild => {
        var cSubjects = [];
        await Promise.all(guild.channels.cache.map(async channel => {
            if (channel.name.match(subjectRegex)) {
                cSubjects[cSubjects.length] = channel.name;
            }
        }));

        var rSubjects = [];
        await Promise.all(guild.roles.cache.map(async role => {
            if (role.name.toLowerCase().match(subjectRegex)) {
                rSubjects[rSubjects.length] = role.name;
            }
        }));
        
        const missingChannels = rSubjects.filter(e => !cSubjects.includes(e));

        await Promise.all(missingChannels.map(async subjectCode => {
            client.tools.createSubject(guild, subjectCode);
        }));
    }));
}

async function checkSubjectOverwrites(client) {
    // Looping through all guilds
    await Promise.all(client.guilds.cache.map(async guild => {
        const subjectCategories = await guild.channels.cache.filter(channel => channel.type == 'category' && channel.name.toLowerCase().replace(/[0-9]/g, '') == ' level subjects');

        // Looping through all categories
        await Promise.all(subjectCategories.map(async category => {
            const subjectChannels = await category.children.filter(channel => channel.type == 'text');

            // Making channels invisible
            if (category.permissionsFor(category.guild.roles.everyone).toArray().includes('VIEW_CHANNEL')) {
                await category.updateOverwrite(category.guild.roles.everyone, {
                    'VIEW_CHANNEL': false
                });
                console.log(`Denied @everyone to view #${category.name}`);
            }

            // Looping through all channels
            await Promise.all(subjectChannels.map(async channel => {
                var subjectRole = await channel.guild.roles.cache.find(role => role.name.toLowerCase() == channel.name.toLowerCase());

                if (!subjectRole) {
                    if (!guild.roleColour) {
                        var guildData = await client.Database.fetchGuild(guild.id);
                        guild.roleColour = guildData.roleColour;
                    }

                    subjectRole = await guild.roles.create({
                        data: {
                            name: channel.name.toUpperCase(),
                            color: guild.roleColour
                        }
                    });
                    console.log(`Created @${subjectRole.name}`);
                }

                if (!channel.permissionsFor(subjectRole).toArray().includes('VIEW_CHANNEL')) {
                    channel.updateOverwrite(subjectRole, {
                        'VIEW_CHANNEL': true
                    });
                    console.log(`Allowed @${subjectRole.name} to view #${channel.name}`);
                }
            }));
        }));
    }));
}

async function checkMuteOverwrites(client) {
    // Looping through all guilds
    await Promise.all(client.guilds.cache.map(async guild => {
        const mutedRole = await guild.roles.cache.find(r => r.name.toLowerCase() == 'muted');

        // Looping through all categories
        const categories = await guild.channels.cache.filter(channel => channel.type == 'category')
        await Promise.all(categories.map(async category => {
            updateMutedOverwrites(category, mutedRole);
        }));

        // Looping through all channels
        await Promise.all(guild.channels.cache.map(async channel => {
            updateMutedOverwrites(channel, mutedRole);
        }))
    }));
}

async function updateMutedOverwrites(channel, mutedRole) {
    var perms = channel.permissionOverwrites.find(r => r.id == mutedRole.id)
    if (perms) {
        if (perms.deny.has((channel.type == 'voice') ? 'SPEAK' : 'SEND_MESSAGES')) {
            return;
        }
    }
    channel.updateOverwrite(mutedRole, {
        [(channel.type == 'voice') ? 'SPEAK' : 'SEND_MESSAGES']: false
    });
    console.log(`Denied @${mutedRole.name} to type in #${channel.name}`);
}