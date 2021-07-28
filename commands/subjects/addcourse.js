const { MessageEmbed } = require("discord.js");

module.exports = {
    description: 'Add or remove a course role, this will allow members to apply this role to themselves using the join command', 
    arguments: '<course role>~role', 
    minArgs: 1, 
    location: 'spoke', 
    cooldown: 5, 
    permissions: ['MANAGE_ROLES'], 
    execute: async ({ client, message, args }) => {
        const course = args[0].name.toLowerCase();
        const embed = new MessageEmbed();
        
        if (message.guild.data.courses.includes(course)) {
            console.log(message.guild.data.courses)
            
            let index = message.guild.data.courses.indexOf(course);
            message.guild.data.courses.splice(index, 1);
            message.guild.data.markModified('courses'); 
            await message.guild.data.save();
            client.tools.log(`removed ${course} from the course list`, message.guild);
            
            embed.setTitle(`Removed ${course} from the course list`)
                .setColor(client.config.successColour)
                .setDescription(`Members can no longer choose this role`);

                console.log(message.guild.data.courses)

        } else {
            
            message.guild.data.courses[message.guild.data.courses.length] = course;
            message.guild.data.markModified('courses'); 
            await message.guild.data.save();
            client.tools.log(`added ${course} to the course list`, message.guild);
            
            embed.setTitle(`Added ${course} to the course list`)
                .setColor(client.config.successColour)
                .setDescription(`Members can now join this course using \`${message.guild.data.prefix}join ${course}\``);
        }
        message.reply(embed);
    }
}