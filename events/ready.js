module.exports = {
    once: true,
    execute: (client) => {
        client.user.setPresence({
            status: 'online',
            activity: {
                name: "*help",
                type: "PLAYING"
            }
        });
        console.log('Connected to Discord');
    }
}