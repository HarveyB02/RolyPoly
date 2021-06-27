module.exports = {
    description: 'Mute a user',
    textOnly: true,
    permissions: ['MANAGE_ROLES'],
    minArgs: 1,
    maxArgs: 2,
    arguments: '<user>~member [time (m, d, w)]',
    cooldown: 5,
    execute: async ({ client, message, args, data }) => {
        if (args.length > 1) { // Timed mute (uses database)
            var expiryDate;
            const unit = args[1].substring(args[1].length - 1);
            const duration = args[1].substring(0, args[1].length - 1);

            // Checking duration is a number
            if (isNaN( parseInt(duration) )) {
                var description = `Invalid number was provided, please use \`\`\`${message.guild.prefix}mute <user> [time (m, d, w)]\`\`\``;
                        
                client.tools.errorMsg(message, 'Invalid argument type', description);
                return;
            }

            // Different time units (mins, days, weeks)
            switch (unit) {
                case 'm':
                    expiryDate = new Date(new Date().getTime() + (duration * 60000));
                    break;
                case 'd':
                    expiryDate = new Date(new Date().getDate + duration);
                    break;
                case 'w':
                    expiryDate = new Date(new Date().getDate + (duration * 7));
                    break;
                default: 
                    var description = `Invalid time unit was provided, please use m, d or w e.g.\`\`\`${message.guild.prefix}mute @Harvey 30m\`\`\``;
                            
                    client.tools.errorMsg(message, 'Invalid time unit', description);
                    return;
            }

            // Add to database
            client.Database.createMute(args[0].id, message.guild.id, expiryDate);
        } 

        var mutedRole = await message.guild.roles.cache.find(r => r.name.toLowerCase() == 'muted');

        if (!mutedRole) {

        }
    }
}