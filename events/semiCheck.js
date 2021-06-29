module.exports = {
    execute: async (client) => {
        await client.database.checkMutes(client);
    }
}