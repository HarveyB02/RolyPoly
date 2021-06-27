module.exports = {
    execute: (client) => {
        client.Database.checkMutes(client);
    }
}