module.exports = {
    once: true,
    execute: (client) => {
        // Presence
        client.user.setPresence({
            status: 'online',
            activity: {
                name: "Ping for Help",
                type: "PLAYING"
            }
        });
        client.tools.log('Connected to Discord');
    }
}