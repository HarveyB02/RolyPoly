const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    description: 'Add or remove channels from the allowlist. The allowlist will be toggled if no argument is provided',
    permissions: ['MANAGE_GUILD'],
    location: 'text',
    textOnly: true,
    minArgs: 0,
    maxArgs: 1,
    arguments: '[channel to add/remove]~channel',
    cooldown: 5,
    execute: async ({ client, message, args }) => {
        const embed = new MessageEmbed();
        
        // Toggle, or add/remove channel
        if (args[0]) {
            // Warning footer
            if (!message.guild.data.allowListToggle) {
                embed.setFooter(`Allowlist is currently disabled, enable it using "${message.guild.data.prefix}allowlist"`)
            }
            // Checking if already in allowlist
            if (message.guild.data.botChannelNames.includes(args[0].name)) {
                // Removing from database
                var index = message.guild.data.botChannelNames.indexOf(args[0]);
                message.guild.data.botChannelNames.splice(index, 1);
                message.guild.data.markModified('botChannelNames'); // Need to mark as modified, as arrays are weird with mongoDB
                await message.guild.data.save();
                client.tools.log(`removed #${args[0].name} from the allowlist`, message.guild);

                // Response
                embed.setTitle(`Removed #${args[0].name} from the allowlist`)
                    .setColor(config.successColour)
                    .setDescription(message.guild.data.botChannelNames.length ? `the allowlist now contains: ${message.guild.data.botChannelNames.join(', ')}` : 'The allowlist is now empty');
            
            } else {
                // Adding to database
                message.guild.data.botChannelNames[message.guild.data.botChannelNames.length] = args[0].name;
                message.guild.data.markModified('botChannelNames'); // Need to mark as modified, as arrays are weird with mongoDB
                await message.guild.data.save();
                client.tools.log(`added #${args[0].name} to the allowlist`, message.guild);

                // Response
                embed.setTitle(`Added #${args[0].name} to the allowlist`)
                    .setColor(config.successColour)
                    .setDescription(`Allowlist now contains: ${message.guild.data.botChannelNames.join(', ')}`);
            }
        } else {
            message.guild.data.allowListToggle = !message.guild.data.allowListToggle;
            await message.guild.data.save();

            if (message.guild.data.allowListToggle) {
                client.tools.log('enabled allowlist');
                // Response
                embed.setTitle('Enabled allowlist')
                    .setColor(config.successColour)
                    .setDescription('Bot commands can only be used in allowed channels');
            } else {
                client.tools.log('disabled allowlist');
                // Response
                embed.setTitle('Disabled allowlist')
                    .setColor(config.successColour)
                    .setDescription('Bot commands can be used anywhere');
            }
        }
        message.reply(embed);
    }
}