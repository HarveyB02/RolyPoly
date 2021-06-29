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

        for (var i = 0; i < words.length; i ++) {
            if (filter.includes(words[i].toLowerCase().replace(/[^a-z]/g, '')) ||
                filter.includes(words[i].toLowerCase().replace(/[^a-z]/g, '').replace(/(.)(?=\1)/g, ''))) {
                profane = true;
                words[i] = words[i].replace(/./g, '\\*');
            }
        }

        if (profane) {
            let content = words.join(' ');
            client.tools.sendWebhook(message.channel, message.author.username, content, message.author.displayAvatarURL());
            message.delete();
        }
    }

    // Help
    if (message.mentions.users.find(u => u.id == client.user.id)){
        message.reply('Imagine finishing the help menu 😔');
    }

    // Gettting arguments & data
    var args, guildData;
    if (message.channel.type == 'dm') {
        args = message.content.trim().split(/ +/);
    } else {
        if (!message.guild.prefix) {
            guildData = await client.database.fetchGuild(message.guild.id);
            message.guild.prefix = guildData.prefix;
        }

        args = message.content.slice(message.guild.prefix.length).trim().split(/ +/);
        if (!message.content.startsWith(message.guild.prefix)) return;
    }

    // Getting command name
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    // DM only command
    if (command.dmOnly) {
        if (message.channel.type != 'dm') return;
    }

    // Text channel only command
    if (command.textOnly) {
        if (message.channel.type != 'text') return;
    }

    // Owner only command
    if (command.ownerOnly) {
        if (!client.config.ownerIDs.includes(message.author.id)) {
            return;
        }
    }

    // Hub server only command
    if (command.hubOnly) {
        if (message.guild.id != process.env.HUBID) {
            return;
        }
    }

    // Spoke server only command
    if (command.spokeOnly) {
        if (message.guild.id == process.eng.HUBID) {
            return;
        }
    }

    // Check user permissions
    if (command.permissions) {
        if (!message.member.hasPermission(command.permissions)) {
            var permList = ''

            for (const perm of command.permissions) {
                permList += perm.toLowerCase().replace(/_/g, '') + ', ';
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
                description += `, please use \`\`\`\n${command.dmOnly ? '' : message.guild.prefix}${commandName} ${command.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``;
                if (command.example) {
                    description += `For example: \`\`\`\n${command.dmOnly ? '' : message.guild.prefix}${commandName} ${command.example}\`\`\``
                }
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
                description += `, please use \`\`\`\n${command.dmOnly ? '' : message.guild.prefix}${commandName} ${command.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``;
            }

            client.tools.errorMsg(message, 'Too many arguments', description);
            return;
        } 
    }

    // Check argument types
    if (command.arguments) {
        argType = command.arguments.trim().replace(/[<\[].*?[>\]]| +/g, '').split('~')
        argType.shift();

        for (var i = 0, exit = false; i < argType.length && !exit; i ++) {
            switch (argType[i]) {

                // Check valid integer
                case 'int':
                    if (isNaN( parseInt(args[i]) )) {
                        var description = `Invalid number was provided, please use \`\`\`${command.dmOnly ? '' : message.guild.prefix}${commandName} ${command.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``;
                        
                        client.tools.errorMsg(message, 'Invalid argument type', description);
                        return;
                    }
                    break;

                // Check valid channel
                case 'channel':
                    if (!args[i]) args[i] = '';

                    const channel = message.guild.channels.cache.find(c => c.id == args[i].replace(/[<#>]/g, ''));

                    if (!channel) {
                        var description = `Invalid channel was provided, please use \`\`\`${command.dmOnly ? '' : message.guild.prefix}${commandName} ${command.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``;
                        
                        client.tools.errorMsg(message, 'Invalid argument type', description);
                        return;
                    }

                    args[i] = channel;
                    break;

                // Check valid role
                case 'role':
                    if (!args[i]) args[i] = '';

                    const role = message.guild.roles.cache.find(r => r.id == args[i].replace(/[<@&>]/g, ''));

                    if (!role) {
                        var description = `Invalid role was provided, please use \`\`\`${command.dmOnly ? '' : message.guild.prefix}${commandName} ${command.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``;
                        
                        client.tools.errorMsg(message, 'Invalid argument type', description);
                        return;
                    }

                    args[i] = role;
                    break;

                // Check valid member
                case 'member':
                    if (!args[i]) args[i] = '';

                    const member = message.guild.members.cache.find(m => m.id == args[i].replace(/[<@!>]/g, ''))

                    if (!member) {
                        var description = `Invalid user was provided, please use \`\`\`${command.dmOnly ? '' : message.guild.prefix}${commandName} ${command.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``;
                        
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

    // Get data
    var data = {};
    data.command = command;
    if (!guildData && message.channel.type == 'text') {
        guildData = await client.database.fetchGuild(message.guild.id);
        data.guild = guildData;
    }                                                                                                                                         

    // Execute command
    try {
        client.tools.log(`@${message.author.tag} used "${message.content}"`, message.guild);
        command.execute({
            client: client,
            message: message,
            args: args,
            data: data
        });
    } catch (error) {
        console.log(error);
        message.reply('An error occured while executing this command');
    }
}