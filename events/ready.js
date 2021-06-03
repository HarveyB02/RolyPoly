module.exports = {
    once: true,
    execute: (client) => {
        client.user.setPresence({
            status: 'online',
            activity: {
                name: "DM me to start",
                type: "PLAYING"
            }
        });
        console.log('Loaded');
    }
}