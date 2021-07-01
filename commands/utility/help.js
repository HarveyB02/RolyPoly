const { MessageEmbed } = require("discord.js");

module.exports = {
    description: 'Why are you asking for help on help?',
    arguments: '[command name]',
    maxArgs: 1,
    cooldown: 5,
    execute: async ({ client, message, args }) => {
        if (!args.length) {
            const embed = new MessageEmbed()
                .setTitle(`${client.user.username} Help Menu`)
                .setDescription(message.channel.type != 'dm' ? `The bot prefix is: ${message.guild.data.prefix}` : '')
                .setColor(client.config.successColour)
                .setFooter(`Use ${message.channel.type != 'dm' ? message.guild.data.prefix : ''}help <command name> for more info`);

            // Looping through categories
            const categories = await client.commands.map(c => c.category).filter((item, index, self) => {
                return self.indexOf(item) == index;
            });
            await Promise.all(categories.map(async category => {
                // Finding valid commands
                const commands = await client.commands.filter(command => {
                    // Is in category
                    if (command.category != category) return;
                    // Usable by user in this channel
                    switch (command.location) {
                        case 'dm':
                            if (message.channel.type != 'dm') return;
                            break;
                        case 'text':
                            if (message.channel.type == 'dm') return;
                            break;
                        case 'hub':
                            if (message.channel.type == 'dm') return;
                            if (message.guild.id != client.config.hubID) return;
                            break;
                        case 'spoke':
                            if (message.channel.type == 'dm') return;
                            if (message.guild.id == client.config.hubID) return;
                            break;
                    }
                    // Permissions
                    if (command.permissions) {
                        if (!message.member.hasPermission(command.permissions)) return;
                    }
                    return command;
                });
                // Response
                commandNames = commands.map(c => c.name.charAt(0).toUpperCase() + c.name.slice(1));
                if (commandNames.length > 0) {
                    embed.addField(category.charAt(0).toUpperCase() + category.slice(1), commandNames.join(', '));
                }
            }))
            message.reply(embed);
        } else {
            // Command info
            const command = await client.commands.find(command => command.name == args[0].toLowerCase());
            if (!command) {
                client.tools.errorMsg(message, 'Command doesn\'t exist', `Could not find a command with the name ${args[0]}, type \`${message.channel.type != 'dm' ? message.guild.data.prefix : ''}help\` for a list of commands`);
                return;
            }

            const embed = new MessageEmbed()
                .setTitle(command.name.charAt(0).toUpperCase() + command.name.slice(1))
                .setColor(client.config.successColour);
            
            // Description
            if (command.description) embed.setDescription(command.description);

            // Usage
            if (command.arguments) {
                embed.addField('Usage', `\`\`\`\n${message.channel.type == 'dm' ? '' : message.guild.data.prefix}${command.name} ${command.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``);
            }

            // Permissions
            if (command.permissions) {
                var permList = ''
                for (const perm of command.permissions) {
                    permList += perm.toLowerCase().replace(/_/g, ' ') + ', ';
                }
                permList = permList.substring(0, permList.length - 2);

                embed.addField('Required permissions', permList.charAt(0).toUpperCase() + permList.slice(1));
            }

            // Cooldown
            if (command.cooldown) {
                embed.addField('Cooldown', `${command.cooldown} seconds`, true);
            }

            // Restrictions
            var restrictions = [];

            switch (command.location) {
                case 'dm':
                    restrictions[restrictions.length] = 'DMs only';
                    break;
                case 'text':
                    restrictions[restrictions.length] = 'servers only';
                    break;
                case 'hub':
                    restrictions[restrictions.length] = 'hub server only';
                    break;
                case 'spoke':
                    restrictions[restrictions.length] = 'spoke server only';
                    break;
            }

            if (command.ownerOnly) restrictions[restrictions.length] = 'owner use only';

            if (restrictions.length > 0) {
                restrictions = restrictions.join(', ');
            restrictions = restrictions.charAt(0).toUpperCase() + restrictions.slice(1);
            embed.addField('Restrictions', restrictions, true);
            }

            message.reply(embed);
        }
    }
}