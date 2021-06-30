module.exports = {
    execute: async (client) => {
        await client.database.checkMutes(client);
        await client.database.checkBans(client);
    }
}