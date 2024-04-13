import dotenv from 'dotenv';

import { SearchEngine } from './types.js';
dotenv.config();

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
    keepAlive: process.env.KEEP_ALIVE ? parseBoolean(process.env.KEEP_ALIVE) : false, // for https://replit.com keep alive bot 24/7
    autoNode: process.env.AUTO_NODE ? parseBoolean(process.env.AUTO_NODE) : true, // auto node for lavamusic bot it is gave from lavainfo-api "https://lavainfo-api.freedback-dip.workers.dev"
    searchEngine: process.env.SEARCH_ENGINE || SearchEngine.YouTube, // search engine for music
    maxPlaylistSize: process.env.MAX_PLAYLIST_SIZE ? parseInt(process.env.MAX_PLAYLIST_SIZE) : 100, // max playlist size
    botStatus: process.env.BOT_STATUS || 'online', // online, idle, dnd, invisible
    botActivity: process.env.BOT_ACTIVITY || 'Lavamusic', // set the bot activity
    botActivityType: process.env.BOT_ACTIVITY_TYPE ? parseInt(process.env.BOT_ACTIVITY_TYPE) : 2, // 0 = PLAYING, 1 = STREAMING, 2 = LISTENING, 3 = WATCHING
    maxQueueSize: process.env.MAX_QUEUE_SIZE ? parseInt(process.env.MAX_QUEUE_SIZE) : 100, // max queue size
    owners: process.env.OWNER_IDS ? JSON.parse(process.env.OWNER_IDS) : [], // bot owners
    clientId: process.env.CLIENT_ID, // bot client id
    guildId: process.env.GUILD_ID, // guild id
    logChannelId: process.env.LOG_CHANNEL_ID || '', // log channel id
    links: {
        img: process.env.IMG_LINK || 'https://i.imgur.com/ud3EWNh.jpg',
    }, // image links
    icons: {
        youtube: 'https://i.imgur.com/xzVHhFY.png',
        spotify: 'https://i.imgur.com/qvdqtsc.png',
        soundcloud: 'https://i.imgur.com/MVnJ7mj.png',
        applemusic: 'https://i.imgur.com/Wi0oyYm.png',
        deezer: 'https://i.imgur.com/xyZ43FG.png',
    }, // music icons
    production: process.env.PRODUCTION ? parseBoolean(process.env.PRODUCTION) : true,
    lavalink: [
        {
            url: process.env.LAVALINK_URL,
            auth: process.env.LAVALINK_AUTH,
            name: process.env.LAVALINK_NAME,
            secure: process.env.LAVALINK_SECURE ? parseBoolean(process.env.LAVALINK_SECURE) : false,
        },
    ], // lavalink nodes
};

function parseBoolean(value: string | undefined): boolean {
    if (typeof value === 'string') {
        value = value.trim().toLowerCase();
    }
    switch (value) {
        case 'true':
            return true;
        default:
            return false;
    }
}
/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
