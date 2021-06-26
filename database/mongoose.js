const guildSchema = require('./Schema/guild.js');

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