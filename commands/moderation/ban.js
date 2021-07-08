module.exports = {
    description: 'Ban a member for a certain amount of time. Ban will not expire if no time is provided',
    location: 'text',
    permissions: ['BAN_MEMBERS'],
    minArgs: 1,
    arguments: '<user>~member [time (m, d, w)]',
    cooldown: 5,
    execute: async ({ client, message, args }) => {
        if (!args[0].bannable) {
            client.tools.errorMsg(message, 'Cannot ban user', 'Bot is not able to ban this user');
            return;
        }

        // Clean database
        client.database.removeBan(args[0]);

        if (args.length > 1) { // Timed ban (uses database)
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
                    var description = `Invalid time unit was provided, please use m, d or w \`\`\`\n${message.channel.type == 'dm' ? '' : message.guild.data.prefix}${module.exports.name} ${module.exports.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\`For example:\`\`\`${message.guild.data.prefix}ban @Harvey 30m\`\`\``;
                            
                    client.tools.errorMsg(message, 'Invalid time unit', description);
                    return;
            }

            // Checking duration is a number
            if (isNaN( parseInt(duration) )) {
                var description = `Invalid number was provided, please use \`\`\`\n${message.channel.type == 'dm' ? '' : message.guild.data.prefix}${module.exports.name} ${module.exports.arguments.replace(/~.+?(?=( |$))/g, '')}\`\`\``;
                return;
            }

            // Checking duration length
            if (duration < 1 || duration > 100) {
                client.tools.errorMsg(message, 'Argument out of bounds','The number you entered is too high/low')
                return;
            }

            // Add to database
            client.database.createBan(args[0], expiryDate);
        }

        // Banning user
        await args[0].ban();

        // Confirmation
        message.react('✅');
        client.tools.log(`Banned @${args[0].user.tag}${
            expiryDate ? ` until ${expiryDate.getDate()}/${expiryDate.getMonth() + 1} ${client.tools.format12Hour(expiryDate)}` : ''
        }`, message.guild);
    }
}