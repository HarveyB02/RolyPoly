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

module.exports.createMute = async (userID, guildID, expires) => {
    new muteSchema({
        userID: userID,
        guildID: guildID,
        expires: expires
    }).save();
}

module.exports.checkMutes = (client) => {
    muteSchema.find({}, (err, users) => {
        users.map(user => {
            if (user.expires < Date.now()) {
                user.remove();

                var guild = client.guilds.cache.find(g => g.id == user.guildID);
                if (!guild) return;
                var member = guild.members.cache.find(m => m.id == user.userID);
                if (!member) return;
                var mutedRole = member.roles.cache.find(r => r.name.toLowerCase() == 'muted');
                if (!mutedRole) return;

                member.roles.remove(mutedRole);
                console.log(`Unmuted ${member.name} from ${guild.name}`);
            }
        });
    });
}