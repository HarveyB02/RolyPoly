module.exports = {
    description: 'Mute a member for a certain amount of time. Mute will not expire if no time is provided',
    location: 'text',
    permissions: ['MANAGE_ROLES'],
    minArgs: 1,
    arguments: '<user>~member [time (m, d, w)]',
    cooldown: 5,
    execute: async ({ client, message, args }) => {
        // Check if already muted
        var isMuted = await client.database.isMuted(args[0]);
        if (isMuted) {
            client.tools.errorMsg(message, 'User already muted', `<@!${args[0].id}> is already muted, please unmute them first`)
            return;
        }

        if (args.length > 1) { // Timed mute (uses database)
            var expiryDate;
            const unit = args[1].substring(args[1].length - 1);
            const duration = args[1].substring(0, args[1].length - 1);

            // Different time units (mins, days, weeks)
            switch (unit) {
                case 'm':
                    expiryDate = new Date(new Date().getTime() + (duration * 60000));
                    break;
                case 'd':
                    expiryDate = new Date(new Date().getTime() + (duration * 86400000));
                    break;
                case 'w':
                    expiryDate = new Date(new Date().getTime() + (duration * 86400000 * 7));
                    break;
                default: 
                    // Error msg if invalid time unit
                    var description = `Invalid time unit was provided, please use m, d or w \`\`\`\n${message.channel.type == 'dm' ? '' : message.guild.data.prefix}mute ${module.exports.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\`For example:\`\`\`${message.guild.data.prefix}mute @Harvey 30m\`\`\``;
                            
                    client.tools.errorMsg(message, 'Invalid time unit', description);
                    return;
            }

            // Checking duration is a number
            if (isNaN( parseInt(duration) )) {
                // Error msg
                var description = `Invalid number was provided, please use \`\`\`\n${message.channel.type == 'dm' ? '' : message.guild.data.prefix}mute ${module.exports.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``;
                client.tools.errorMsg(message, 'Invalid argument type', description);
                return;
            }

            // Add to database
            client.database.createMute(args[0], expiryDate);
        }

        // Muting user
        var mutedRole = await client.muteTools.fetchMutedRole(message.guild);
        await args[0].roles.add(mutedRole);

        // Confirmation
        message.react('✅');
        client.tools.log(`Muted @${args[0].user.tag}${
            expiryDate ? ` until ${expiryDate.getDate()}/${expiryDate.getMonth() + 1} ${client.tools.format12Hour(expiryDate)}` : ''
        }`, message.guild);
    }
}