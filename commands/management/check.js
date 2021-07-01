module.exports = {
    description: 'Force checks over all guilds', 
    maxArgs: 0, 
    location: 'spoke', 
    cooldown: 10, 
    ownerOnly: true, 
    execute: async ({ client, message }) => {
        client.emit('semiCheck');
        client.emit('fullCheck');
        
        message.react('✅');
    }
}