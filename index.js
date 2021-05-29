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

client.on('ready', message => {
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
                description += `, please use \`\`\`\n${config.prefix}${commandName} ${command.arugments.replace(/~.+?( |$)/g, '')}`;
            }
        }
    }
})

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