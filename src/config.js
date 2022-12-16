import dotenv from "dotenv";
dotenv.config();
export const config = {
    token: process.env.TOKEN || "",
    clientId: process.env.CLIENT_ID || "",
    prefix: process.env.PREFIX || "!",
    ownerID: process.env.OWNER_ID || ["959276033683628122"],
    SpotifyID: process.env.SPOTIFY_ID || "",
    SpotifySecret: process.env.SPOTIFY_SECRET || "",
    mongourl: process.env.MONGO_URL || "",

    color: {
        default: process.env.DEFAULT_COLOR || "#00FF00",
        error: process.env.ERROR_COLOR || "#FF0000",
        success: process.env.SUCCESS_COLOR || "#00FF00",
        info: process.env.INFO_COLOR || "#00FFFF",
        warn: process.env.WARN_COLOR || "#FFFF00",
    },
    production: process.env.PRODUCTION || true,
    guildId: process.env.GUILD_ID || "",
    emotes: {
        success: "✅",
        error: "❌",
        info: "ℹ️",
        warn: "⚠️",
        stop: "⏹️",
        skip: "⏭️",
        play: "▶️",
        pause: "⏸️",
        loop: "🔁",
        previous: "⏮️",
    },

    logs: process.env.LOGS || "channel_id",
    errorLogsChannel: process.env.ERROR_LOGS_CHANNEL || "channel_id",
    SearchPlatform: process.env.SEARCH_PLATFORM || "youtube music",
    AggregatedSearchOrder: process.env.AGGREGATED_SEARCH_ORDER || "youtube music,youtube,soundcloud",
    links: {
        img: process.env.IMG || 'https://media.discordapp.net/attachments/963097935820750878/983300268131225651/20220606_145403.png',
        support: process.env.SUPPORT || 'https://discord.gg/ns8CTk9J3e',
        invite: process.env.INVITE || 'https://discord.com/oauth2/authorize?client_id=977742811132743762&permissions=8&scope=bot%20applications.commands' //bot invite link
    },
    nodes: [
        {
            url: process.env.NODE_URL || "54.37.6.86",
            name: process.env.NODE_NAME || "1",
            auth: process.env.NODE_AUTH || "Blacky#9125",
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
            rturn false;
    }
}
