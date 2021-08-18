const { MessageEmbed } = require("discord.js");
const redirect = require("./redirect");

module.exports = {
    description: 'Remove the redirect from a subject code', 
    arguments: '<redirect from>',
    minArgs: 1, 
    location: 'spoke', 
    cooldown: 5,
    permissions: ['MANAGE_ROLES'], 
    execute: async ({ client, message, args }) => {
        const embed = new MessageEmbed();
        embed.setColor(client.config.successColour);

        args[0] = args[0].toLowerCase();

        if (!args[0].match(client.subjectRegex)) {
            embed.setTitle('Invalid subject code');
            embed.setDescription('The subject code provided is invalid');
            embed.setColor(config.failColour);
        } else {
            let redirectExists = null;
            for (let i = 0; i < message.guild.data.redirects.length; i++) {
                let redirect = message.guild.data.redirects[i];
                if (redirect.from == args[0]) {
                    redirectExists = redirect;
                    break;
                }
            }

            if (redirectExists) {
                let index = message.guild.data.redirects.indexOf(redirectExists);
                message.guild.data.redirects.splice(index, 1);
                message.guild.data.markModified('redirects'); 
                await message.guild.data.save();
                client.tools.log(`removed redirect from ${redirectExists.from.toUpperCase()} to ${redirectExists.to.toUpperCase()}`, message.guild);
                
                embed.setTitle(`Removed Redirect`)
                    .setColor(client.config.successColour)
                    .setDescription(`Removed redirect from ${redirectExists.from.toUpperCase()} to ${redirectExists.to.toUpperCase()}`);
            } else {
                embed.setTitle('Redirect Does Not Exist')
                    .setDescription(`There is no redirect from ${args[0].toUpperCase()}. You can list all redirects you have set, or add more using the \`redirect\` command`)
                    .setColor(client.config.failColour);
            }
        }
        message.reply(embed);
    }
}