import "dotenv/config";
import { SearchEngine } from "./types.js";

const parseBoolean = (value) => {
    if (typeof value !== "string") return false;
    return value.trim().toLowerCase() === "true";
};

export default {
    token: process.env.TOKEN,
    prefix: process.env.PREFIX,
    color: {
        red: 0xff0000,
        green: 0x00ff00,
        blue: 0x0000ff,
        yellow: 0xffff00,
        main: 0x2f3136,
    },
    emoji: {
        // You can add custom emoji with ID format (e.g., <:emojiName:123456789012345678>)
        pause: "⏸️",
        resume: "▶️",
        stop: "⏹️",
        skip: "⏩",
        previous: "⏪",
        forward: "⏭️",
        replay: "🔄",
        voldown: "🔉",
        volup: "🔊",
        shuffle: "🔀",
        loop: {
            none: "🔁",
            track: "🔂",
        },
        page: {
            last: "⏩",
            first: "⏪",
            back: "⬅️",
            next: "➡️",
            cancel: "⏹️",
        },
    },
    defaultLanguage: process.env.DEFAULT_LANGUAGE,
    topGG: process.env.TOPGG,
    keepAlive: parseBoolean(process.env.KEEP_ALIVE),
    autoNode: parseBoolean(process.env.AUTO_NODE),
    searchEngine: SearchEngine[process.env.SEARCH_ENGINE] || SearchEngine.YouTubeMusic,
    maxPlaylistSize: parseInt(process.env.MAX_PLAYLIST_SIZE || "100"),
    botStatus: process.env.BOT_STATUS || "online",
    botActivity: process.env.BOT_ACTIVITY || "Lavamusic",
    botActivityType: parseInt(process.env.BOT_ACTIVITY_TYPE || "2"),
    maxQueueSize: parseInt(process.env.MAX_QUEUE_SIZE || "100"),
    owners: process.env.OWNER_IDS ? JSON.parse(process.env.OWNER_IDS) : [],
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    logChannelId: process.env.LOG_CHANNEL_ID,
    commandLogs: process.env.LOG_COMMANDS_ID,
    links: {
        img: process.env.IMG_LINK || "https://i.imgur.com/ud3EWNh.jpg",
    },
    icons: {
        youtube: "https://i.imgur.com/xzVHhFY.png",
        spotify: "https://i.imgur.com/qvdqtsc.png",
        soundcloud: "https://i.imgur.com/MVnJ7mj.png",
        applemusic: "https://i.imgur.com/Wi0oyYm.png",
        deezer: "https://i.imgur.com/xyZ43FG.png",
        jiosaavn: "https://i.imgur.com/N9Nt80h.png",
    },
    lavalink: process.env.LAVALINK_SERVERS
        ? JSON.parse(process.env.LAVALINK_SERVERS).map((server) => {
              return {
                  url: server.url,
                  auth: server.auth,
                  name: server.name,
                  secure: parseBoolean(server.secure),
              };
          })
        : [],
};

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
