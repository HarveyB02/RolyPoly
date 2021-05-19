const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
require('dotenv').config();

const talkedRecently = new Set();
const classRegex = /^[a-z]{4}[1-4][0-9]{2}$/;

var csitGuild;

client.guilds.fetch(process.env.GUILD)
		.then(guild => csitGuild = guild)
		.catch(console.error);

client.on('ready', () => {
	client.user.setPresence({
		status: 'online',
		activity: {
			name: "DM me to start",
			type: "PLAYING"
		}
	});
	console.log('Ready');
});

client.on('message', (message) => {
	
	if (message.author.bot) return;

	if (message.channel.type == 'text') { // For messages in servers
		if (message.content == process.env.PREFIX + 'try') {
			message.channel.send('https://tryitands.ee/');
			return;
		} else if ( message.content == process.env.PREFIX + 'dnw') {
			message.channel.send('**Does not work** is not sufficient information to provide to receive help.\n - What\'s the expected (wanted) behaviour\n - What\'s the actual (unwanted) behaviour?\n - Do you get any errors?\n - What\'s your relevant code that might be causing the issue?');
			return;
		} else if ( message.content == process.env.PREFIX + 'code') {
			message.channel.send('**Use code blocks** whenever pasting code.\nTo send a code block, use 3 backticks (\\`) followed by your code language name, your code on a newline, then close it off with another 3 backticks. e.g.\n\\`\\`\\`java\nSystem.out.print("Hello world.");\n\\`\\`\\`');
			message.channel.send('https://imgur.com/a/FgwuXER');
			return;
		}
			
		if (!message.content.startsWith(process.env.PREFIX) ||
		!message.member.hasPermission('MANAGE_CHANNELS') ||
		!message.member.hasPermission('MANAGE_ROLES')) return;

		const args = [...new Set(message.content.toLowerCase().slice(process.env.PREFIX.length).trim().split(/ +/g))];
		const command = args.shift().toLowerCase();
		
		if (command == 'add') {
			for (var i = 0; i < args.length && i < 10; i++) {
				newSubject(args[i])
					.then(response => message.channel.send(response));
			}
		} else if (command == 'remove') {
			for (var i = 0; i < args.length && i < 10; i++) {
				removeSubject(args[i])
					.then(response => message.channel.send(response));
			}
		} else if (command == 'createroles') {
			createRoles();
		}
	
	} else if (message.channel.type == 'dm') { // For direct messages
	
		const args = [...new Set(message.content.toLowerCase().trim().split(/ +/g))];
		const command = args.shift().toLowerCase();
		
		if (command == 'join') {
			if (args.length == 0) return;
			
			if (talkedRecently.has(message.author.id)) {
				message.channel.send('**⚠️ Error:** This command is on cooldown for 1 minute.\nYou can join multiple subjects with one join command by entering multiple subjects, separated by spaces. e.g.\n> join csit111 csit113 csit114 csit115');
			} else {
				talkedRecently.add(message.author.id);
				setTimeout(() => {
					talkedRecently.delete(message.author.id);
				}, 60000);
				
				for (var i = 0; i < args.length && i < 5; i++) {
					joinSubject(args[i], message.author)
						.then(response => message.channel.send(response));
				}
			}
		} else if (command == 'leave') {
			for (var i = 0; i < args.length && i < 5; i++) {
				leaveSubject(args[i], message.author)
					.then(response => message.channel.send(response));
			}
		} else if (command == 'leaveall') {
			leaveAll(message.author)
				.then(response => message.channel.send(response));
		} else if (command == 'cs') {
			csitRoles(message.author.id, 'cs')
				.then(response => message.channel.send(response));
		} else if (command == 'it') {
			csitRoles(message.author.id, 'it')
				.then(response => message.channel.send(response));
		} else {
			helpMsg(message.channel, message.author.username);
		}
		
	}
	
	return;
});

client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.log(error);
			return;
		}
	}
	
	if (reaction.message.author.id != '832935165457858590') return;
	if (!reaction.message.content.startsWith('**Subject')) return;
	if (reaction.count != 2) return;
	
	var details = getDetails(reaction.message.content);
	
	if (reaction.emoji.name == '✅') {
		reaction.message.delete();
		giveRole(details[0], details[1]);
		reaction.message.channel.send('Added subject "' + details[0] + '"');
		msgUser(details[1], 'Your request to create channel "' + details[0] + '" has been approved.');
	} else if (reaction.emoji.name == '❌') {
		reaction.message.delete();
		msgUser(details[1], 'Your request to create channel "' + details[0] + '" has been denied.');
	}
	
	return;
});

client.on('guildMemberAdd', (member) => {
	helpMsg(member, member.user.username);
});

async function newSubject(subjectCode) {
	if (!subjectCode.match(classRegex)) {
		return '**⚠️ Error:** "' + subjectCode + '" isn\'t a valid subject code';
	}
	
	if (csitGuild.roles.cache.find(role => role.name == subjectCode) ||
	csitGuild.channels.cache.find(channel => channel.name == subjectCode)) {
		return '**⚠️ Error:** "' + subjectCode + '" already exists';
	} else {
		
		var subjectRole = await csitGuild.roles.create({
			data: {
				name: subjectCode,
				color: process.env.ROLECOLOUR
			}
		})
		
		var subjectLvl;
		
		switch (Number(subjectCode.match(/\d/))) {
			default:
				return '**⚠️ Error:** "' + subjectCode + '" isn\'t a valid subject code';
				break;
			case 1:
				subjectLvl = '100 level subjects';
				break;
			case 2:
				subjectLvl = '200 level subjects';
				break;
			case 3:
				subjectLvl = '300 level subjects';	
				break;
			case 4:
				subjectLvl = '400 level subjects';	
		}
		
		csitGuild.channels.create(subjectCode, {
			type: 'text',
			parent: csitGuild.channels.cache.find(channel => channel.name.toLowerCase() == subjectLvl)
		})
		
		return 'Added subject ' + subjectCode + '"';
	}
}

async function joinSubject(subjectCode, student) {
	if (!subjectCode.match(classRegex)) {
		return '**⚠️ Error:** Invalid subject code: "' + subjectCode + '"';
	}
	
	var csitMember = await csitGuild.members.fetch(student.id);
	if (!csitMember) return "**⚠️ Error:** You're not a member of the CSIT Discord server!";
	
	if (csitMember.roles.cache.find(role => role.name == subjectCode)) {
		return "**⚠️ Error:** You're already enrolled in \"" + subjectCode + '"';
	}
	
	var subjectRole = await csitGuild.roles.cache.find(role => role.name == subjectCode);
	
	if (subjectRole) {
		csitMember.roles.add(subjectRole);
		return "You've been added to the subject \"" + subjectCode + '"';
	} else {
		var modChannel = await csitGuild.channels.cache.find(channel => channel.id == process.env.MODCHANNEL);
		var approvalMsg = await modChannel.send('**Subject Approval request**\nUser: <@' + csitMember.id + '>\nSubject: ' + subjectCode);
		await approvalMsg.react('✅');
		await approvalMsg.react('❌');
		return 'We don\'t have a channel for "' + subjectCode + "\" right now. I've asked moderators for approval to create one now.";
	}
}

async function leaveSubject(subjectCode, student) {
	var csitMember = await csitGuild.members.fetch(student.id);
	if (!csitMember) return "**⚠️ Error:** You're not a member of the CSIT Discord server.";
	
	var subjectRole = await csitMember.roles.cache.find(role => role.name == subjectCode);
	if (!subjectRole) return "**⚠️ Error:** You're not currently in \"" + subjectCode + '"';
	
	await csitMember.roles.remove(subjectRole);
	return 'You have been unenrolled from "' + subjectCode + '"';
}

async function leaveAll(student) {
	var csitMember = await csitGuild.members.fetch(student.id);
	if (!csitMember) return "**⚠️ Error:** You're not a member of the CSIT Discord server.";
	var subjects = '';
	
	const memberRoles = await csitMember.roles.cache.map(role => role);
	
	await memberRoles.forEach( async role => {
		if (role.name.match(classRegex)) {
			subjects = subjects + role.name + ' ';
			await csitMember.roles.remove(role);
		}
	});
	if (subjects == '') {
		return '**⚠️ Error:** No subjects to unenroll from';
	} else {
		return 'Unenrolled from: "' + subjects + '"';
	}
}

function getDetails(messageContent) {
	var user = messageContent.split('\n')[1].split(' ')[1].replace(/[<>@]/g, '');
	var subject = messageContent.split('\n')[2].split(' ')[1];
	
	var details = [subject, user];
	return details;
}

async function giveRole(subjectCode, studentID) {
	var csitMember = await csitGuild.members.fetch(studentID);
	
	var subjectRole = await csitGuild.roles.cache.find(role => role.name == subjectCode);
	if (!subjectRole) {
		await newSubject(subjectCode);
		subjectRole = await csitGuild.roles.cache.find(role => role.name == subjectCode);
	}
	
	csitMember.roles.add(subjectRole);
}

async function msgUser(userID, content) {
	var csitMember = await csitGuild.members.fetch(userID);
	if (!csitMember) return;
	
	csitMember.send(content);
	return;
}

async function removeSubject(subjectCode) {
	var subjectRole = await csitGuild.roles.cache.find(role => role.name == subjectCode);
	var subjectChannel = await csitGuild.channels.cache.find(channel => channel.name == subjectCode);
	var output;
	
	if (subjectRole && subjectChannel) {
		await subjectRole.delete();
		await subjectChannel.delete();
		output = 'Removed subject "' + subjectCode + '"';
	} else if (subjectRole) {
		await subjectRole.delete();
		output = 'Removed role ' + subjectCode + '"';
	} else if (subjectChannel) {
		await subjectChannel.delete();
		output = 'Removed channel "' + subjectCode + '"';
	} else {
		output = '**⚠️ Error:** Subject "' + subjectCode + "\" doesn't exist";
	}
	
	return output;
}

function helpMsg(channel, username) {
	channel.send('**Hi ' + username + ", i'm the CSIT Community subject manager.**\nI can add you to your currently enrolled subjects!\nOnce you're added, you'll be able to see your subject channel in the Discord server!\n\n**To join a subject type:**\n> join {subjectname}\n\n**To leave a subject type:**\n> leave {subjectname}\n\n**To leave all your subjects type:**\n> leaveall\n\nCommands accept multiple subjects, separated by spaces. E.g. join csit111 csit115\n**For your degree role, type either CS or IT.**")
}

async function createRoles() {
	var modChannel = await csitGuild.channels.cache.find(channel => channel.id == process.env.MODCHANNEL);
	
	const channels = await csitGuild.channels.cache.map(channel => channel);
	
	await channels.forEach( async channel => {
		
		var subjectRole = await csitGuild.roles.cache.find(role => role.name == channel.name);
		
		if (channel.name.match(classRegex) && !subjectRole) {
			
			var subjectRole = await csitGuild.roles.create({
				data: {
					name: channel.name,
					color: process.env.ROLECOLOUR
				}
			})
			
			await modChannel.send('Created role "' + channel.name + '"');
		}
	});
}

async function csitRoles(userID, roleName) {
	var csitMember = await csitGuild.members.fetch(userID);
	var role = await csitGuild.roles.cache.find(role => role.name.toLowerCase() == roleName);
	
	if (roleName == 'cs') {
		var itRole = csitMember.roles.cache.find(role => role.name.toLowerCase() == 'it');
		if (itRole) {
			csitMember.roles.remove(itRole);
		}
	} else {
		var csRole = csitMember.roles.cache.find(role => role.name.toLowerCase() == 'cs');
		if (csRole) {
			csitMember.roles.remove(csRole);
		}
	}
	await csitMember.roles.add(role);
	return 'Applied role ' + roleName.toUpperCase();
}

client.login(process.env.TOKEN);