module.exports = {
    description: 'Force checks over all guilds', 
    maxArgs: 0, 
    location: 'spoke', 
    cooldown: 10, 
    ownerOnly: true, 
    execute: ({ client, message }) => {
        client.tools.log('Performing semi check');
        client.emit('semiCheck');

        client.tools.log('Performing full check');
        client.emit('fullCheck');
        
        message.react('✅');
    }
}