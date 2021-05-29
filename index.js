const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const config = require('./config.json');

const client = new Discord.Client([ 'MESSAGE', 'REACTION' ]);
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        const commandName = command.name || file.substring(0, file.length - 3);
        client.commands.set(commandName, command);
    }
}

client.on('ready', () => {
    console.log('Loaded');
});

client.on('message', message => {
    if (message.partial) {
        message.fetch()
            .then(fullmessage => message = fullMessage)
            .catch(error => console.log('Something went wrong when fetching the message: ' + error));
    }

    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.ownerOnly) {
        if (!config.ownerIDs.includes(message.author.id)) {
            replyError(message, 'Owner only command', 'This command is restricted to the owner of the bot only.');
            return;
        }
    }

    if (command.permissions) {
        if (!message.member.hasPermission(command.permissions)) {
            var permList = ''

            for (const perm of command.permissions) {
                permlist += perm.toLowerCase().replace(/_/g, '') + ', ';
            }
            permList = permList.substring(0, permList.length - 2);

            replyError(message, 'Insufficient permissions', 'You require: ' + permList + ' to use this command');
            return;
        }
    }

    if (command.minArgs) {
        if (args.length < command.minArgs) {
            let description = 'Not enough arguments were provided';

            if (command.arguments) {
                description += `, please use \`\`\`\n${config.prefix}${commandName} ${command.arguments.replace(/~.+?( |$)/g, '')}\`\`\``;
            }

            replyError(message, 'Not enough arguments', description);
            return;
        }
    }

    if (command.maxArgs) {
        if (args.length > command.maxArgs) {
            let description = 'Too many arguments were provided';

            if (command.arguments) {
                description += `, please use \`\`\`\n${config.prefix}${commandName} ${command.arguments.replace(/~.+?( |$)/g, '')}\`\`\``;
            }

            replyError(message, 'Too many arguments', description);
            return;
        } 
    }

    if (command.arguments) {
        argType = command.arguments.trim().replace(/<.*?>| |\[/g, '').split(']');
        argType.pop();

        let exit = false;
        for (var i = 0; i < argType.length && !exit; i ++) {
            switch (argType[i]) {

                case 'int':
                    if (isNaN( parseInt(args[i]) )) {
                        var description = `Invalid number was provided, please use ${config.prefix}${commandName} ${command.arguments.replace(/\[(.*?)\]/g, "")}`;
                        
                        replyError(message, 'Invalid argument type', description);
                        return;
                    }
                    break;

                case 'channel':
                    if (!args[i]) args[i] = '';

                    const channel = message.guild.channels.cache.find(c => c.id == args[i].replace(/[<#>]/g, ''));

                    if (!channel) {
                        var description = `Invalid channel was provided, please use ${config.prefix}${commandName} ${command.arguments.replace(/\[(.*?)\]/g, "")}`;
                        
                        replyError(message, 'Invalid argument type', description);
                        return;
                    }

                    args[i] = channel;
                    break;

                case 'role':
                    if (!args[i]) args[i] = '';

                    const role = message.guild.roles.cache.find(r => r.id == args[i].replace(/[<@&>]/g, ''));

                    if (!role) {
                        var description = `Invalid role was provided, please use ${config.prefix}${commandName} ${command.arguments.replace(/\[(.*?)\]/g, "")}`;
                        
                        replyError(message, 'Invalid argument type', description);
                        return;
                    }

                    args[i] = role;
                    break;
                case 'member':
                    if (!args[i]) args[i] = '';

                    const member = message.guild.members.cache.find(m => m.id == args[i].replace(/[<@!>]/g, ''))

                    if (!member) {
                        var description = `Invalid user was provided, please use ${config.prefix}${commandName} ${command.arguments.replace(/\[(.*?)\]/g, "")}`;
                        
                        replyError(message, 'Invalid argument type', description);
                        return;
                    }

                    args[i] = member;
                    break;
            }
        }
    }

    if (command.cooldown) {
        const { cooldowns } = client;

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownTime = (command.cooldown) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownTime;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;

                replyError(message, 'Cooldown', `${commandName} is on cooldown for another ${timeLeft.toFixed(1)}s`);
                return;
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownTime);
    }

    const params = {
        message: message,
        args: args,
        prefix: config.prefix
    };

    try {
        command.execute(params);
    } catch (error) {
        if (command.error) {
            try {
                command.error(params, error);
            } catch (error) {
                message.reply('An error occured while executing this command');
            }
            message.reply(error);
        }
    }
});

function replyError(message, title, description) {
    const channel = message.channel;
    message.delete();

    const embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(0xED4245);

    channel.send(embed)
        .then(m => {
            m.delete({ timeout: 5000 })
            .catch(error => console.log(error))
        });
}

exports.replyError = replyError;

client.login(process.env.TOKEN);