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
    production: process.env.PRODUCTION || false,
    guildId: process.env.GUILD_ID || "959703767333359630",
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
    icons: {
        youtube: 'https://media.discordapp.net/attachments/963097935820750878/1054328059639111700/3670147.png',
        spotify: 'https://media.discordapp.net/attachments/963097935820750878/1054333449252655104/spotify.png',
        soundcloud: 'https://media.discordapp.net/attachments/963097935820750878/1054333449638526986/145809.png',
        applemusic: 'https://media.discordapp.net/attachments/963097935820750878/1054333450368340018/apple-music-icon.png',
        deezer: 'https://media.discordapp.net/attachments/963097935820750878/1054333450024394802/5968803.png'
    },
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
            return false;
    }
}
