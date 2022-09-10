require("dotenv").config();

module.exports = {
    token: process.env.TOKEN || "token",  // your bot token
    clientID: process.env.CLIENT_ID || "936958193194639410", // your bot client id
    prefix: process.env.PREFIX || "<", // bot prefix
    ownerID: process.env.OWNERID || "602900188549611543", //your discord id
    SpotifyID: process.env.SPOTIFYID || "client_id",
    SpotifySecret: process.env.SPOTIFYSECRET || "client_secret",
    mongourl: process.env.MONGO_URI || "uri", // MongoDb URL
    embedColor: process.env.COlOR || 0x303236, // embed colour
    logs: process.env.LOGS || "978694899350245427", // channel id for guild create and delete logs
    links: {
        img: process.env.IMG || 'https://media.discordapp.net/attachments/963097935820750878/983300268131225651/20220606_145403.png', //setup system background image 
        support: process.env.SUPPORT || 'https://discord.gg/ns8CTk9J3e', //support server invite link
        invite: process.env.INVITE || 'https://discord.com/oauth2/authorize?client_id=977742811132743762&permissions=8&scope=bot%20applications.commands' //bot invite link
    },
    nodes: [
        {
            host: process.env.NODE_HOST || "lavalink.oops.wtf",
            port: parseInt(process.env.NODE_PORT || "443"),
            password: process.env.NODE_PASSWORD || "www.freelavalink.ga",
            secure: parseBoolean(process.env.NODE_SECURE || "true"),

        }
    ],

}

function parseBoolean(value) {
    if (typeof (value) === 'string') {
        value = value.trim().toLowerCase();
    }
    switch (value) {
        case true:
        case "true":
            return true;
        default:
            return false;
    }
}
