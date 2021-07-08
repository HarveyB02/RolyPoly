const { MessageEmbed } = require("discord.js");

module.exports = {
    execute: async (reaction, user, client) => {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.log(error);
                return;
            }
        }

        // Check if valid request msg
        if (reaction.message.author.id != client.user.id) return;
        if (reaction.message.embeds[0].title != 'Subject Approval Request') return;
        if (reaction.count != 2) return;

        // Parse info from request msg
        let subjectCode = reaction.message.embeds[0].fields[1].value.toLowerCase();
        let memberID = reaction.message.embeds[0].fields[0].value;
        memberID = memberID.substring(2, memberID.length - 1);

        const guild = await reaction.message.guild;
        const member = await guild.members.fetch(memberID);
        
        if (!member) return;

        // Accept request
        if (reaction.emoji.name == '✅') {
            reaction.message.delete();
            
            client.subjectTools.createSubject(guild, subjectCode, member);

            const embed = new MessageEmbed()
                .setTitle(`${guild.name} - ${subjectCode.toUpperCase()} Subject Request`)
                .setDescription(`Your request to add the subject **${subjectCode.toUpperCase()}** has been approved. There is now a dedicated channel and role which you have been assigned`)
                .setColor(0x57F278);

            member.send(embed);

        // Deny request
        } else if (reaction.emoji.name == '❌') {
            reaction.message.delete();

            const embed = new MessageEmbed()
                .setTitle(`${guild.name} - ${subjectCode.toUpperCase()} Subject Request`)
                .setDescription(`Your request to create the subject channel **${subjectCode.toUpperCase()}** has been denied. This is most likely because the subject you requested is not a real UOW subject.`)
                .setFooter('If you believe this is a mistake, please contact a moderator')
                .setColor(0xED4245);

            member.send(embed);
        }
    }
}