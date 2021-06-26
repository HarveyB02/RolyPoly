const index = require('../../RolyPoly');
const { MessageEmbed } = require("discord.js");

module.exports = {
    aliases: ['del', 'purge', 'prune'],
    description: 'Deletes a set amount of messages from the current channel (max 100)',
    permissions: ['MANAGE_MESSAGES'],
    arguments: '<quantity (1-100)>~int',
    minArgs: 1,
    maxArgs: 1,
    cooldown: 5,
    textOnly: true,
    
    execute: async ({ message, args }) => {
        if (!message || !args) return;

        if (args[0] > 100 || args[0] <= 0) {
            index.replyError(message, 'Argument out of bounds','The number you entered is too high/low');
            return;
        }

        const channel = message.channel;
        await message.delete()
            .catch(console.error);
        
        const messages = await channel.bulkDelete(args[0])
            .catch(console.error);
        
        const embed = new MessageEmbed()
            .setTitle(messages.size == 1 ? `Deleted 1 message` : `Deleted ${ messages.size } messages`)
            .setColor(0x57F278);

        channel.send(embed)
            .then( m => {
                m.delete({ timeout: 5000 })
                    .catch(console.error);
            });
    }
}