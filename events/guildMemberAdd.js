const { MessageEmbed } = require('discord.js');

module.exports = {
    execute: async (member, client) => {
        if (!member.guild.data) member.guild.data = await client.database.fetchGuild(member.guild);

        const embed1 = new MessageEmbed()
            .setTitle('Getting Started')
            .setDescription('New to Discord? Start [here](https://support.discord.com/hc/en-us/articles/360045138571-Beginner-s-Guide-to-Discord)\n\n' + member.guild.name + ' contains a channel for each subject code. Here, you can ask questions, talk about course material and form study groups!')
            .setColor(0xCB225A);

        const embed2 = new MessageEmbed()
            .setTitle('Commands')
            .setDescription('A command is used by typing the bot\'s prefix (' + member.guild.data.prefix + ' for ' + member.guild.name + ') followed by the name of the command, for example `' + member.guild.data.prefix + 'help`.\n\nCommands must be used in a server, you cannot use commands via direct messages')
            .setColor(0xCB225A)
            .addField('Joining subjects', 'To join a subject, use the join command. Type `' + member.guild.data.prefix + 'join` followed by the subjects that you are currently enrolled in. For example, if I were enrolled in SUBJ111, SUBJ112 and SUBJ113 I would type `' + member.guild.data.prefix + 'join subj111 subj112 subj113`.\n\nPlease make sure you use the correct subject code!')
            .addField('Leaving subjects', 'Once you\'ve completed a subject, you may leave it using the leave command. The leave command is used in the same way as the join command. For example, `' + member.guild.data.prefix + 'leave subj111 subj112`.\n*You can leave all of the subjects you have joined using the leaveall command.*')
            .addField('Tip', 'Too many channels? You can hide all channels you haven\'t marked yourself as enrolled in using the hide command. Simply type `' + member.guild.data.prefix + 'hide` to toggle visibility of other subject channels.')
            .setFooter('Need help? Message one of ' + member.guild.name + '\'s staff');

        member.send('Hey, welcome to ' + member.guild.name + '! I\'m the subject manager, my purpose is to help you navigate the server.\n\nHere\'s a quick rundown of my features and how to use them.\n_ _', {embed: embed1})
            .then(() => member.send(embed2))
            .catch(() => console.log(`Could not send welcome message to ${member.user.tag}`));
    }
}