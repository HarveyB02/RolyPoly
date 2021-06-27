module.exports = {
    once: true,
    execute: (client) => {
        client.user.setPresence({
            status: 'online',
            activity: {
                name: "Ping for Help",
                type: "PLAYING"
            }
        });
        console.log('Connected to Discord');
    }
}