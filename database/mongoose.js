const guildSchema = require('./Schema/guild.js');
const muteSchema = require('./schema/mute.js');
const banSchema = require('./schema/ban.js');
const log = require('../tools/tools.js').log;

module.exports.fetchGuild = async (guild) => {
    let guildDB = await guildSchema.findOne({ id: guild.id });

    if (guildDB) {
        return guildDB;
    } else {
        guildDB = new guildSchema({
            id: guild.id
        })
        await guildDB.save().catch(error => console.log(error));
        log(`created database document`, guild);
        return guildDB;
    }
}

// Mute
module.exports.createMute = async (member, expires) => {
    new muteSchema({
        userID: member.id,
        guildID: member.guild.id,
        expires: expires
    }).save();
}

module.exports.removeMute = async (member) => {
    muteSchema.find({ userID: member.id, guildID: member.guild.id }, (err, mutes) => {
        mutes.map(async mute => {
            mute.remove();
        });
    });
}

module.exports.isMuted = async (member) => {
    // Check if user has muted role
    var mutedRole = await member.roles.cache.find(r => r.name.toLowerCase() == 'muted');
    if (mutedRole) {
        return true;
    }

    // If user isn't muted, but entry is in DB, delete entry
    let muteDB = await muteSchema.findOne({ userID: member.id, guildID: member.guild.id });
    if (muteDB) {
        muteDB.remove();
    }

    return false;
}

module.exports.checkMutes = async (client) => {
    // Loop through all mutes
    muteSchema.find({}, (err, mutes) => {
        mutes.map(async mute => {
            // Check if mute expired
            if (mute.expires < Date.now()) {
                mute.remove();

                var guild = await client.guilds.cache.find(g => g.id == mute.guildID);
                if (!guild) return;
                var member = await guild.members.cache.find(m => m.id == mute.userID);
                if (!member) return;
                var mutedRole = await member.roles.cache.find(r => r.name.toLowerCase() == 'muted');
                if (!mutedRole) return;

                member.roles.remove(mutedRole);
                log(`Unmuted @${member.user.tag}`, guild);
            }
        });
    });
}

// Ban
module.exports.createBan = async (member, expires) => {
    new banSchema({
        userID: member.id,
        guildID: member.guild.id,
        expires: expires
    }).save();
}

module.exports.removeBan = async (member) => {
    banSchema.find({ userID: member.id, guildID: member.guild.id }, (err, bans) => {
        bans.map(async ban => {
            ban.remove();                                                      
        });
    });
}

module.exports.checkBans = async (client) => {
    // Loop through all bans
    banSchema.find({}, (err, bans) => {
        bans.map(async ban => {
            // Check if ban expired
            if (ban.expires < Date.now()) {
                ban.remove();

                var guild = await client.guilds.cache.find(g => g.id == ban.guildID);
                if (!guild) return;
                
                const bans = await guild.fetchBans();
                const ban = bans.find(b => b.user.id == ban.userID);
                await guild.members.unban(ban.userID);
                log(`Unbanned <@!${ban.userID}>`, guild);
            }
        });
    });
}