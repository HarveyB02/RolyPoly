// Importing modules
const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

// Adding to the client
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.config = require('./config.json');
client.tools = require('./tools.js');

async function init() {
    // Load Discordjs Events
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (!event.name) event.name = file.substring(0, file.length - 3);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }

    // Load commands
    const folders = fs.readdirSync('./commands');
    for (const folder of folders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`);
            if (!command.name) command.name = file.substring(0, file.length - 3);
            client.commands.set(command.name, command);
        }
    }

    await client.login(process.env.TOKEN);
}

init();

