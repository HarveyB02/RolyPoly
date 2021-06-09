const { MessageEmbed } = require("discord.js");

module.exports = {
    description: 'List all commands and info',
    arguments: '[command name]',
    cooldown: 5,
    execute: async ({message, args}) => {
        const { commands, config } = message.client;

        if (!args.length) {
            var commandList = '';

            await Promise.all(commands.map(async command => {
                if (command.permissions) {
                    
                }
            }));

            const embed = new MessageEmbed()
                .setTitle('Help Menu')
                .setColor(0x57F278)
                .addField('List of commands', commands.map(command => command.name).join(', '))
            data.push('Here\'s a list of all my commands:');
            data.push();
            data.push(`\nYou can send \`${config.prefix}help [command name]\` to get info on a specific command!`);

            message.channel.send(data, { split: true });
        }
    }
}