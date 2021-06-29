const guildSchema = require('./Schema/guild.js');
const muteSchema = require('./schema/mute.js');

module.exports.fetchGuild = async (key) => {
    let guildDB = await guildSchema.findOne({ id: key });

    if (guildDB) {
        return guildDB;
    } else {
        guildDB = new guildSchema({
            id: key
        })
        await guildDB.save().catch(error => console.log(error));
        return guildDB;
    }
}

module.exports.isMuted = async (client, userID, guildID) => {
    // Check if user has muted role
    var guild = await client.guilds.cache.find(g => g.id == guildID);
    if (guild) {
        var member = await guild.members.cache.find(m => m.id == userID);
        if (member) {
            var mutedRole = await member.roles.cache.find(r => r.name.toLowerCase() == 'muted');
            if (mutedRole) {
                return true;
            }
        }
    }

    // If user isn't muted, but entry is in DB, delete entry
    let muteDB = await muteSchema.findOne({ userID: userID, guildID: guildID });
    if (muteDB) {
        muteDB.remove();
    }

    return false;
}

module.exports.createMute = async (userID, guildID, expires) => {
    new muteSchema({
        userID: userID,
        guildID: guildID,
        expires: expires
    }).save();
}

module.exports.removeMute = async (userID, guildID) => {
    muteSchema.find({ userID: userID, guildID: guildID }, (err, users) => {
        users.map(async user => {
            user.remove();                                                      
        });
    });
}

module.exports.checkMutes = async (client) => {
    // Loop through all users
    muteSchema.find({}, (err, users) => {
        users.map(async user => {
            // Check if mute expired
            if (user.expires < Date.now()) {
                user.remove();

                var guild = await client.guilds.cache.find(g => g.id == user.guildID);
                if (!guild) return;
                var member = await guild.members.cache.find(m => m.id == user.userID);
                if (!member) return;
                var mutedRole = await member.roles.cache.find(r => r.name.toLowerCase() == 'muted');
                if (!mutedRole) return;

                member.roles.remove(mutedRole);
                client.tools.log(`Unmuted @${member.user.tag}`, guild);
            }
        });
    });
}