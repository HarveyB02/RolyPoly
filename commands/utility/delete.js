const { MessageEmbed } = require("discord.js");
const config = require('../../config.json');

module.exports = {
    aliases: ['del', 'purge', 'prune'],
    description: 'Deletes a set amount of messages from the current channel (max 100)',
    permissions: ['MANAGE_MESSAGES'],
    arguments: '<quantity (1-100)>~int',
    minArgs: 1,
    maxArgs: 1,
    cooldown: 5,
    location: 'text',
    execute: async ({ client, message, args }) => {
        // Checking quantity
        if (args[0] > 100 || args[0] <= 0) {
            client.tools.errorMsg(message, 'Argument out of bounds','The number you entered is too high/low');
            return;
        }

        // Deleting
        await message.delete()
        const messages = await message.channel.bulkDelete(args[0])
        
        const embed = new MessageEmbed()
            .setTitle(messages.size == 1 ? `Deleted 1 message` : `Deleted ${ messages.size } messages`)
            .setColor(0x57F278);

        message.channel.send(embed)
            .then( m => {
                m.delete({ timeout: 5000 })
                    .catch(console.error);
            });
    }
}