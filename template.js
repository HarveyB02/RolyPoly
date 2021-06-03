const config = require('../../config.json');
const { MessageEmbed } = require("discord.js");

module.exports = {
    description: '',
    dmOnly: false,
    textOnly: false,
    ownerOnly: false,
    permissions: [],
    minArgs: 0,
    maxArgs: 0,
    arguments: '',
    cooldown: 0,
    execute: async ({message, args, prefix}) => {

    },
    error: async ({message, args, prefix}, error) => {

    }
}