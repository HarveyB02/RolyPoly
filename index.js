const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Discord.Client([ 'MESSAGE', 'REACTION' ]);
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.config = require('./config.json');
client.filter = require('./filter.json');
client.replyError = function replyError(message, title, description) {
    const channel = message.channel;
    if (message.channel.type == 'text') {
        message.delete();
    }
    
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

const commandFolders = fs.readdirSync('./commands');
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        const commandName = command.name || file.substring(0, file.length - 3);
        client.commands.set(commandName, command);
    }
}

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    const eventName = event.name || file.substring(0, file.length - 3);
    if (event.once) {
        client.once(eventName, (...args) => event.execute(...args, client));
    } else {
        client.on(eventName, (...args) => event.execute(...args, client));
    }
}

client.login(process.env.TOKEN);