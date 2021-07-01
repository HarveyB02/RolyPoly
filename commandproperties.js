module.exports = {
    name: '', // String, Overwrite the name of the command (name of file is default)
    aliases: [''], // Array of strings, alternative command names
    description: '', // String, Write a description, used in help menu
    arguments: '', // String, Expected arguments
    minArgs: 0, // Integer, Minimum number of arguments
    maxArgs: 1, // Integer, Maximum number of arguments
    location: '', // String, Where command can be used (dm, text, hub or spoke)
    cooldown: 0, // Integer, Cooldown in seconds
    permissions: [''], // Array of permission flags
    ownerOnly: false, // Boolean, Owner only command
    execute: ({ client, message, args }) => {
        // Code to run
    }
}