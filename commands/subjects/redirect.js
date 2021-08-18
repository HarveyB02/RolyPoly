const { MessageEmbed } = require("discord.js");

module.exports = {
    description: 'Add or remove a subject redirect, use this for subjects that have two codes. Provide no arguments to list all redirects', 
    arguments: '[redirect from] [redirect to]', 
    location: 'spoke', 
    cooldown: 5,
    permissions: ['MANAGE_ROLES'], 
    execute: async ({ client, message, args }) => {
        const embed = new MessageEmbed();
        embed.setColor(client.config.successColour);

        if (args.length < 2) {
            let output = "";
            for (let i = 0; i < message.guild.data.redirects.length; i++) {
                let redirect = message.guild.data.redirects[i];
                output = output + `${redirect.from.toUpperCase()} to ${redirect.to.toUpperCase()}\n`;
            }
            embed.setTitle('Subject Redirects')
                .setDescription(message.guild.data.redirects.length == 0 ? 'You have not set any subject redirects' : output);
            message.reply(embed);
            return;
        }

        args[0] = args[0].toLowerCase();
        args[1] = args[1].toLowerCase();

        if (!args[0].match(client.subjectRegex) || !args[1].match(client.subjectRegex)) {
            embed.setTitle('Invalid subject code')
                .setDescription('The subject code provided is invalid')
                .setColor(config.failColour);
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
                embed.setTitle('Redirect Already Exists')
                    .setDescription(`You already have a redirect from ${redirectExists.from.toUpperCase()} to ${redirectExists.to.toUpperCase()}. Please use the \`delredirect\` command to remove this first`)
                    .setColor(config.failColour);
            } else {
                message.guild.data.redirects.push({
                    from: args[0],
                    to: args[1]
                });
                message.guild.data.markModified('courses');
                await message.guild.data.save();
                client.tools.log(`added redirect from ${args[0].toUpperCase()} to ${args[1].toUpperCase()}`, message.guild);
                embed.setTitle(`Redirected ${args[0].toUpperCase()} to ${args[1].toUpperCase()}`)
                    .setDescription(`Users who now attempt to join ${args[0].toUpperCase()} will now be redirected to ${args[1].toUpperCase()} automatically`);
            }
        }
        message.reply(embed);
    }
}