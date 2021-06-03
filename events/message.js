const Discord = require('discord.js');

module.exports = {
    execute: (message, client) => {
        if (message.partial) {
            message.fetch()
                .then(fullMessage => message = fullMessage)
                .catch(error => console.log('Something went wrong when fetching the message: ' + error));
        }
    
        if (message.author.bot) return;
    
        if (message.channel.type == 'text') {
            let words = message.content.split(' ');
            let profane = false;
    
            for (var i = 0; i < words.length; i ++) {
                if (client.filter.includes(words[i].toLowerCase().replace(/[^a-z]/g, ''))) {
                    profane = true;
                    words[i] = words[i].replace(/./g, '\\*');
                }
            }
    
            if (profane) {
                let content = words.join(' ');
                sendWebhook(message.channel, message.author.username, content, message.author.displayAvatarURL());
                message.delete();
            }
        }
    
        var args;
    
        if (message.channel.type == 'dm') {
            args = message.content.trim().split(/ +/);
        } else {
            args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
            if (!message.content.startsWith(client.config.prefix)) return;
        }
    
        const commandName = args.shift().toLowerCase();
    
        const command = client.commands.get(commandName) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
        if (!command) return;
    
        if (command.dmOnly) {
            if (message.channel.type != 'dm') return;
        }
    
        if (command.textOnly) {
            if (message.channel.type != 'text') return;
        }
    
        if (command.ownerOnly) {
            if (!client.config.ownerIDs.includes(message.author.id)) {
                client.replyError(message, 'Owner only command', 'This command is restricted to the owner of the bot only.');
                return;
            }
        }
    
        if (command.permissions) {
            if (!message.member.hasPermission(command.permissions)) {
                var permList = ''
    
                for (const perm of command.permissions) {
                    permList += perm.toLowerCase().replace(/_/g, '') + ', ';
                }
                permList = permList.substring(0, permList.length - 2);
    
                client.replyError(message, 'Insufficient permissions', 'You require: ' + permList + ' to use this command');
                return;
            }
        }
    
        if (command.minArgs) {
            if (args.length < command.minArgs) {
                let description = 'Not enough arguments were provided';
    
                if (command.arguments) {
                    description += `, please use \`\`\`\n${command.dmOnly ? "" : client.config.prefix}${commandName} ${command.arguments.replace(/~.+?( |$)/g, '')}\`\`\``;
                }
    
                client.replyError(message, 'Not enough arguments', description);
                return;
            }
        }
    
        if (command.maxArgs) {
            if (args.length > command.maxArgs) {
                let description = 'Too many arguments were provided';
    
                if (command.arguments) {
                    description += `, please use \`\`\`\n${command.dmOnly ? "" : client.config.prefix}${commandName} ${command.arguments.replace(/~.+?( |$)/g, '')}\`\`\``;
                }
    
                client.replyError(message, 'Too many arguments', description);
                return;
            } 
        }
    
        if (command.arguments) {
            argType = command.arguments.trim().replace(/[<\[].*?[>\]]| +/g, '').split('~')
            argType.shift();
    
            for (var i = 0, exit = false; i < argType.length && !exit; i ++) {
                switch (argType[i]) {
    
                    case 'int':
                        if (isNaN( parseInt(args[i]) )) {
                            var description = `Invalid number was provided, please use \`\`\`${command.dmOnly ? "" : client.config.prefix}${commandName} ${command.arguments.replace(/~.+?( |$)/g, '')}\`\`\``;
                            
                            client.replyError(message, 'Invalid argument type', description);
                            return;
                        }
                        break;
    
                    case 'channel':
                        if (!args[i]) args[i] = '';
    
                        const channel = message.guild.channels.cache.find(c => c.id == args[i].replace(/[<#>]/g, ''));
    
                        if (!channel) {
                            var description = `Invalid channel was provided, please use \`\`\`${command.dmOnly ? "" : client.config.prefix}${commandName} ${command.arguments.replace(/~.+?( |$)/g, '')}\`\`\``;
                            
                            client.replyError(message, 'Invalid argument type', description);
                            return;
                        }
    
                        args[i] = channel;
                        break;
    
                    case 'role':
                        if (!args[i]) args[i] = '';
    
                        const role = message.guild.roles.cache.find(r => r.id == args[i].replace(/[<@&>]/g, ''));
    
                        if (!role) {
                            var description = `Invalid role was provided, please use \`\`\`${command.dmOnly ? "" : client.config.prefix}${commandName} ${command.arguments.replace(/~.+?( |$)/g, '')}\`\`\``;
                            
                            client.replyError(message, 'Invalid argument type', description);
                            return;
                        }
    
                        args[i] = role;
                        break;
                    case 'member':
                        if (!args[i]) args[i] = '';
    
                        const member = message.guild.members.cache.find(m => m.id == args[i].replace(/[<@!>]/g, ''))
    
                        if (!member) {
                            var description = `Invalid user was provided, please use \`\`\`${command.dmOnly ? "" : client.config.prefix}${commandName} ${command.arguments.replace(/~.+?( |$)/g, '')}\`\`\``;
                            
                            client.replyError(message, 'Invalid argument type', description);
                            return;
                        }
    
                        args[i] = member;
                        break;
                }
            }
        }
    
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
    
                    client.replyError(message, 'Cooldown', `${commandName} is on cooldown for another ${timeLeft.toFixed(1)}s`);
                    return;
                }
            }
    
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownTime);
        }
    
        const params = {
            message: message,
            args: args,
            prefix: client.config.prefix
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
    }
}

function sendWebhook(channel, username, content, avatarURL) {
    channel.fetchWebhooks()
        .then(webhook => {
            let foundHook = webhook.find(w => w.name == client.user.username);

            if (!foundHook) {
                channel.createWebhook(client.user.username, client.user.displayAvatarURL())
                    .then(webhook => {
                        webhook.send('', {
                            'username': username,
                            'avatarURL': avatarURL,
                            'content': content
                        })
                            .catch(error => console.log(error));
                    })
            } else {
                foundHook.send(content, {
                    'username': username,
                    'avatarURL': avatarURL
                })
                    .catch(error => console.log(error));
            }
        })
}