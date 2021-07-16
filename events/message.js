const Discord = require('discord.js');
const filter = require('../filter.json');

module.exports.execute = async (message, client) => {
    // Get full message from partial
    if (message.partial) {
        message.fetch()
            .then(fullMessage => message = fullMessage)
            .catch(error => console.log('Something went wrong when fetching the message: ' + error));
    }

    if (message.author.bot) return; // Ignore bots

    // Chat filter
    if (message.channel.type == 'text') {
        let words = message.content.split(' ');
        let profane = false;

        for (let i = 0; i < words.length; i ++) {
            if (filter.includes(words[i].toLowerCase().replace(/[^a-z]/g, '')) ||
                filter.includes(words[i].toLowerCase().replace(/[^a-z]/g, '').replace(/(.)(?=\1)/g, ''))) {
                profane = true;
                words[i] = words[i].replace(/./g, '\\*');
            }
        }

        if (profane) {
            message.delete();
            let content = words.join(' ');
            client.tools.sendWebhook(message.channel, message.author.username, content, message.author.displayAvatarURL());
            let modChannel = await client.tools.fetchModChannel(message.guild);
            await modChannel.send(`@here ${message.author} used profane language`);
            modChannel.send(`>>> ${message.content}`)
        }
    }

    // Help via mention
    if (message.content == `<@!${client.user.id}>`) {
        let help = await client.commands.find(c => c.name == 'help');
        help.execute({
            client: client,
            message: message
        });
        return;
    }

    // Gettting arguments & data
    let args;
    if (message.channel.type == 'dm') {
        args = message.content.trim().split(/ +/);
    } else {
        if (!message.guild.data) {
            message.guild.data = await client.database.fetchGuild(message.guild);
        }
        args = message.content.slice(message.guild.data.prefix.length).trim().split(/ +/);

        if (!message.content.startsWith(message.guild.data.prefix)) return;

        if (message.guild.data.allowListToggle) {
            if (!message.guild.data.botChannelNames.includes(message.channel.name)) {
                if (!message.member.hasPermission('MANAGE_GUILD')) {
                    return;
                }
            }
        }
    }

    // Getting command name
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    // Commmand location
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

    // Owner only command
    if (command.ownerOnly) {
        if (!client.config.ownerIDs.includes(message.author.id)) {
            return;
        }
    }

    // Check user permissions
    if (command.permissions) {
        if (!message.member.hasPermission(command.permissions)) {
            let permList = ''
            for (const perm of command.permissions) {
                permList += perm.toLowerCase().replace(/_/g, ' ') + ', ';
            }
            permList = permList.substring(0, permList.length - 2);

            client.tools.errorMsg(message, 'Insufficient permissions', 'You require: ' + permList + ' to use this command');
            return;
        }
    }

    // Check minimum args count
    if (command.minArgs) {
        if (args.length < command.minArgs) {
            let description = 'Not enough arguments were provided';

            if (command.arguments) {
                description += `, please use \`\`\`\n${message.channel.type == 'dm' ? '' : message.guild.data.prefix}${commandName} ${command.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``;
            }

            client.tools.errorMsg(message, 'Not enough arguments', description);
            return;
        }
    }

    // Check maximum args count
    if (command.maxArgs) {
        if (args.length > command.maxArgs) {
            let description = 'Too many arguments were provided';

            if (command.arguments) {
                description += `, please use \`\`\`\n${message.channel.type == 'dm' ? '' : message.guild.data.prefix}${commandName} ${command.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``;
            }

            client.tools.errorMsg(message, 'Too many arguments', description);
            return;
        } 
    }

    // Check argument types
    if (command.arguments) {
        // Regex to find argument type, matched with optional or not
        argTypes = command.arguments.replace(/<.*?(?=>)|\[.*?(?=])| |]$/g, '')
            .replace(/>~/g, ' <')
            .replace(/]~/g, ' [')
            .split(' ');
        argTypes.shift();

        for (let i = 0, exit = false; i < argTypes.length && !exit; i ++) {
            // Skipping blank unrequired arguments
            if (!args[i]) {
                if (argTypes[i].substring(0, 1) == '[') {
                    continue;
                } else {
                    args[i] = '';
                }
            }

            const argType = argTypes[i].substring(1, argTypes[i].length);
            switch (argType) {
                // Check valid integer
                case 'int':
                    if (isNaN( parseInt(args[i]) )) {
                        let description = `Invalid number was provided, please use \`\`\`${message.channel.type == 'dm' ? '' : message.guild.data.prefix}${commandName} ${command.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``;
                        client.tools.errorMsg(message, 'Invalid argument type', description);
                        return;
                    }
                    break;

                // Check valid channel
                case 'channel':
                    const channel = message.guild.channels.cache.find(c => c.id == args[i].replace(/[<#>]/g, ''));
                    if (!channel) {
                        let description = `Invalid channel was provided, please use \`\`\`${message.channel.type == 'dm' ? '' : message.guild.data.prefix}${commandName} ${command.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``;
                        client.tools.errorMsg(message, 'Invalid argument type', description);
                        return;
                    }
                    args[i] = channel;
                    break;

                // Check valid role
                case 'role':
                    const role = message.guild.roles.cache.find(r => r.id == args[i].replace(/[<@&>]/g, ''));
                    if (!role) {
                        let description = `Invalid role was provided, please use \`\`\`${message.channel.type == 'dm' ? '' : message.guild.data.prefix}${commandName} ${command.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``;
                        client.tools.errorMsg(message, 'Invalid argument type', description);
                        return;
                    }
                    args[i] = role;
                    break;

                // Check valid member
                case 'member':
                    const member = message.guild.members.cache.find(m => m.id == args[i].replace(/[<@!>]/g, ''))
                    if (!member) {
                        let description = `Invalid user was provided, please use \`\`\`${message.channel.type == 'dm' ? '' : message.guild.data.prefix}${commandName} ${command.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``;
                        client.tools.errorMsg(message, 'Invalid argument type', description);
                        return;
                    }
                    args[i] = member;
                    break;
            }
        }
    }

    // Cooldown
    if (command.cooldown) {
        if (!client.cooldowns.has(command.name)) {
            client.cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = client.cooldowns.get(command.name);
        const cooldownTime = (command.cooldown) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownTime;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;

                client.tools.errorMsg(message, 'Cooldown', `${commandName} is on cooldown for another ${timeLeft.toFixed(1)}s`);
                return;
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownTime);
    }                                                                                                                                      

    // Execute command
    try {
        // Logging and running command
        client.tools.log(`(${message.channel.name ? `#${message.channel.name}` : 'DM'}) @${message.author.tag} used "${message.channel.type != 'dm' ? message.content.substring(message.guild.data.prefix.length, message.content.length) : message.content}"`, message.guild);
        command.execute({
            client: client,
            message: message,
            args: args
        });
    } catch (error) {
        console.log(error);
        message.reply('An error occured while executing this command');
    }
}