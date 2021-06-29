// Subject tools
async function updateSubjectOverwrites(channel) {
    if (channel.type == 'text') {
        // Allow subject role to view subject channel
        if (!channel.name.match(channel.client.subjectRegex)) return;

        var subjectRole = await fetchSubjectRole(channel.guild, channel.name);
        if (!channel.permissionsFor(subjectRole).toArray().includes('VIEW_CHANNEL')) {
            channel.updateOverwrite(subjectRole, {
                'VIEW_CHANNEL': true
            });
            channel.client.tools.log(`Allowed @${subjectRole.name} to view #${channel.name}`, channel.guild);
        }
    }
    else if (channel.type == 'category' && channel.name.toLowerCase().replace(/[0-9]/g, '') != ' level subjects') return;

    // Deny everyone to view subject channel or category
    if (channel.permissionsFor(channel.guild.roles.everyone).toArray().includes('VIEW_CHANNEL')) {
        await channel.updateOverwrite(channel.guild.roles.everyone, {
            'VIEW_CHANNEL': false
        });
        channel.client.tools.log(`Denied @everyone to view #${channel.name}`, channel.guild);
    }
}
module.exports.updateSubjectOverwrites = updateSubjectOverwrites;

async function fetchSubjectRole(guild, subjectCode) {
    var subjectRole = await guild.roles.cache.find(role => role.name.toLowerCase() == subjectCode.toLowerCase());

    if (!subjectRole) {
        if (!guild.roleColour) {
            var guildData = await guild.client.database.fetchGuild(guild.id);
            guild.roleColour = guildData.roleColour;
        }

        subjectRole = await guild.roles.create({
            data: {
                name: subjectCode.toUpperCase(),
                color: guild.roleColour
            }
        });
        guild.client.tools.log(`Created @${subjectRole.name}`, guild);
    }

    return subjectRole;
}
module.exports.fetchSubjectRole = fetchSubjectRole;

module.exports.createSubject = async (guild, subjectCode, member) => {
    // Create role
    var subjectRole = await fetchSubjectRole(guild, subjectCode);

    // Create channel
    var subjectChannel = await guild.channels.cache.find(channel => channel.name.toLowerCase() == subjectCode.toLowerCase());
    if (!subjectChannel) {
        var subjectLvl = subjectCode.match(/\d/) + '00 level subjects'

        // Create category
        var parent = await guild.channels.cache.find(channel => channel.name.toLowerCase() == subjectLvl && channel.type == 'category');
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