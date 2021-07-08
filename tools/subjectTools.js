// Subject tools
async function updateSubjectOverwrites(channel) {
    if (channel.type == 'voice') return;
    if (channel.type == 'text') {
        // Allow subject role to view subject channel
        if (!channel.name.match(channel.client.subjectRegex)) return;

        let subjectRole = await fetchSubjectRole(channel.guild, channel.name);
        if (!channel.permissionsFor(subjectRole).toArray().includes('VIEW_CHANNEL')) {
            channel.updateOverwrite(subjectRole, {
                'VIEW_CHANNEL': true
            });
            channel.client.tools.log(`Allowed @${subjectRole.name} to view #${channel.name}`, channel.guild);
        }
    }
    else if (channel.type == 'category') {
        if (channel.name.toLowerCase().replace(/[0-9]/g, '') != ' level subjects') return;
        await channel.client.tools.sortCategory(channel);
    }

    // Deny everyone to view subject channel or category
    if (channel.permissionsFor(channel.guild.roles.everyone).toArray().includes('VIEW_CHANNEL')) {
        await channel.updateOverwrite(channel.guild.roles.everyone, {
            'VIEW_CHANNEL': false
        });
        channel.client.tools.log(`Denied @everyone to view #${channel.name}`, channel.guild);
    }

    let bypassRole = await fetchBypassRole(channel.guild);
    if (!channel.permissionsFor(bypassRole).toArray().includes('VIEW_CHANNEL')) {
        await channel.updateOverwrite(bypassRole, {
            'VIEW_CHANNEL': true
        });
        channel.client.tools.log(`Allowed @${bypassRole.name} to view #${channel.name}`, channel.guild);
    }
}
module.exports.updateSubjectOverwrites = updateSubjectOverwrites;

async function fetchSubjectRole(guild, subjectCode) {
    let subjectRole = await guild.roles.cache.find(role => role.name.toLowerCase() == subjectCode.toLowerCase());

    if (!subjectRole) {
        if (!guild.data) {
            guild.data = await guild.client.database.fetchGuild(guild);
        }

        subjectRole = await guild.roles.create({
            data: {
                name: subjectCode.toUpperCase(),
                color: guild.data.roleColour
            }
        });
        guild.client.tools.log(`Created @${subjectRole.name}`, guild);
    }

    return subjectRole;
}
module.exports.fetchSubjectRole = fetchSubjectRole;

module.exports.createSubject = async (guild, subjectCode, member) => {
    // Create role
    let subjectRole = await fetchSubjectRole(guild, subjectCode);

    // Create channel
    let subjectChannel = await guild.channels.cache.find(channel => channel.name.toLowerCase() == subjectCode.toLowerCase());
    if (!subjectChannel) {
        let subjectLvl = subjectCode.match(/\d/) + '00 level subjects'

        // Create category
        let parent = await guild.channels.cache.find(channel => channel.name.toLowerCase() == subjectLvl && channel.type == 'category');
        if (!parent) {
            parent = await guild.channels.create(subjectLvl, {
                type: 'category'
            });
            guild.client.tools.log(`Created #${parent.name}`, guild);
        }

        subjectChannel = await guild.channels.create(subjectCode, {
            type: 'text',
            parent: parent
        });
        guild.client.tools.log(`Created #${subjectChannel.name}`, guild);
    }

    // Update overwrites
    updateSubjectOverwrites(subjectChannel);

    // Give member role
    if (member) {
        member.roles.add(subjectRole);
    }
}

async function fetchBypassRole(guild) {
    let bypassRole = await guild.roles.cache.find(role => role.name.toLowerCase() == 'view channels');

    if (!bypassRole) {
        if (!guild.data) {
            guild.data = await guild.client.database.fetchGuild(guild);
        }

        bypassRole = await guild.roles.create({
            data: {
                name: 'View channels'
            }
        });
        guild.client.tools.log(`Created @${bypassRole.name}`, guild);
    }

    return bypassRole;
}
module.exports.fetchBypassRole = fetchBypassRole;