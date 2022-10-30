require("dotenv").config();

module.exports = {
    token: process.env.TOKEN || "",  // your bot token
    clientID: process.env.CLIENT_ID || "", // your bot client id
    prefix: process.env.PREFIX || "!", // bot prefix
    ownerID: process.env.OWNER_ID || "", //your discord id
    SpotifyID: process.env.SPOTIFY_ID || "",
    SpotifySecret: process.env.SPOTIFY_SECRET || "",
    mongourl: process.env.MONGO_URL || "", // MongoDb URL
    embedColor: process.env.EMBED_COLOR || 0x303236, // embed colour
    logs: process.env.LOGS || "channel_id", // channel id for guild create and delete logs
    errorLogsChannel: process.env.ERROR_LOGS_CHANNEL || "channel_id", //error logs channel id
    SearchPlatform: process.env.SEARCH_PLATFORM || "youtube music", // Sets the Search Platform. Possibilities: youtube || youtube music || soundcloud
    AggregatedSearchOrder: process.env.AGGREGATED_SEARCH_ORDER || "youtube music,youtube,soundcloud", // Sets the order of Slash command's AutoComplete results
    links: {
        img: process.env.IMG || 'https://media.discordapp.net/attachments/963097935820750878/983300268131225651/20220606_145403.png', //setup system background image 
        support: process.env.SUPPORT || 'https://discord.gg/ns8CTk9J3e', //support server invite link
        invite: process.env.INVITE || 'https://discord.com/oauth2/authorize?client_id=977742811132743762&permissions=8&scope=bot%20applications.commands' //bot invite link
    },
    nodes: [
        {
            host: process.env.NODE_HOST || "54.37.6.86",
            port: parseInt(process.env.NODE_PORT || "80"),
            password: process.env.NODE_PASSWORD || "Blacky#9125",
            secure: parseBoolean(process.env.NODE_SECURE || "false"),

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
