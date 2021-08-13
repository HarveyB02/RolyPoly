// Importing modules
const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

// Adding to the client
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.config = require('./config.json');
client.database = require('./database/mongoose.js');
client.tools = require('./tools/tools.js');
client.muteTools = require('./tools/muteTools.js');
client.subjectTools = require('./tools/subjectTools.js');
client.subjectRegex = /^([a-z]{4}[1-4][0-9]{2})|([a-z]{3}[1-4][0-9]{3})$/;

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
            command.category = folder;
            client.commands.set(command.name, command);
        }
    }

    // Connect
    await Promise.all([
        mongoose.connect(`mongodb+srv://dbAdmin:${process.env.MONGOPASS}@cluster0.tnswn.mongodb.net/RolyPoly?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            client.tools.log('Connected to MongoDB');
        }).catch((error) => {
            client.tools.log(`Unable to connect to MongoDB Database.\nError: ${error}`);
        }), 

        client.login(process.env.TOKEN)
    ]);

    // Checks
    client.emit('semiCheck');
    client.emit('fullCheck');

    setInterval(() => {
        client.emit('semiCheck');
    }, 5 * 60000);
    setInterval(() => {
        client.emit('fullCheck');
    }, 30 * 60000);
}

init();

/*process.on('unhandledRejection', error => {
    console.log(`Unknown error occured:\n${error}`);
});*/