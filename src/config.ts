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
    keepAlive: parseBoolean(process.env.KEEP_ALIVE) || false, // for https://replit.com keep alive bot 24/7
    searchEngine: process.env.SEARCH_ENGINE || (SearchEngine.YouTube as SearchEngine),
    maxPlaylistSize: parseInt(process.env.MAX_PLAYLIST_SIZE) || 100,
    botStatus: process.env.BOT_STATUS || 'online', // online, idle, dnd, invisible
    botActivity: process.env.BOT_ACTIVITY || 'Lavamusic', // set the bot activity
    botActivityType: parseInt(process.env.BOT_ACTIVITY_TYPE || '2'), // 0 to 5 get more info - https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types
    maxQueueSize: parseInt(process.env.MAX_QUEUE_SIZE) || 100,
    owners: JSON.parse(process.env.OWNER_IDS || '[]'),
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET || '',
    guildId: process.env.GUILD_ID,
    logChannelId: process.env.LOG_CHANNEL_ID || '',
    links: {
        img: process.env.IMG_LINK || 'https://i.imgur.com/ud3EWNh.jpg',
    },
    icons: {
        youtube:
            'https://cdn.discordapp.com/attachments/852316384289619968/1142853793822822551/3670147.png',
        spotify:
            'https://media.discordapp.net/attachments/963097935820750878/1054333449252655104/spotify.png',
        soundcloud:
            'https://media.discordapp.net/attachments/963097935820750878/1054333449638526986/145809.png',
        applemusic:
            'https://media.discordapp.net/attachments/963097935820750878/1054333450368340018/apple-music-icon.png',
        deezer: 'https://media.discordapp.net/attachments/963097935820750878/1054333450024394802/5968803.png',
    },
    production: parseBoolean(process.env.PRODUCTION) || true,
    lavalink: [
        {
            url: process.env.LAVALINK_URL,
            auth: process.env.LAVALINK_AUTH,
            name: process.env.LAVALINK_NAME,
            secure: parseBoolean(process.env.LAVALINK_SECURE) || false,
        },
    ],
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
