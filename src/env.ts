import path from "node:path";
import { config } from "dotenv";
import { z } from "zod";

config({
    path: path.join(__dirname, "../.env"),
});

const LavalinkNodeSchema = z.object({
    id: z.string(),
    host: z.string(),
    port: z.number(),
    authorization: z.string(),
    secure: z.boolean().optional(),
    sessionId: z.string().optional(),
    regions: z.string().array().optional(),
    retryAmount: z.number().optional(),
    retryDelay: z.number().optional(),
    requestSignalTimeoutMS: z.number().optional(),
    closeOnError: z.boolean().optional(),
    heartBeatInterval: z.number().optional(),
    enablePingOnStatsCheck: z.boolean().optional(),
});

const envSchema = z.object({
    /**
     * The discord app token
     */
    TOKEN: z.string(),

    /**
     * The client id
     */
    CLIENT_ID: z.string(),

    /**
     * The default language
     */
    DEFAULT_LANGUAGE: z.string().default("EnglishUS"),

    /**
     * The bot prefix
     */
    PREFIX: z.string().default("!"),

    /**
     * The owner ids
     */
    OWNER_IDS: z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val), z.string().array().optional()),

    /**
     * The guild id for devlopment purposes
     */
    GUILD_ID: z.string().optional(),

    /**
     * The Top.gg api key
     */
    TOPGG: z.string().optional(),

    /**
     * The keep alive boolean
     */
    KEEP_ALIVE: z.preprocess((val) => val === "true", z.boolean().default(false)),

    /**
     * The log channel id
     */
    LOG_CHANNEL_ID: z.string().optional(),

    /**
     * The log command id
     */
    LOG_COMMANDS_ID: z.string().optional(),

    /**
     * The bot status online | idle | dnd | invisible
     */
    BOT_STATUS: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                return val.toLowerCase();
            }
            return val;
        },
        z.enum(["online", "idle", "dnd", "invisible"]).default("online"),
    ),

    /**
     * The bot activity
     */
    BOT_ACTIVITY: z.string().default("Lavamusic"),

    /**
     * The bot activity type
     */
    BOT_ACTIVITY_TYPE: z.preprocess((val) => {
        if (typeof val === "string") {
            return parseInt(val, 10);
        }
        return val;
    }, z.number().default(0)),
    /**
     * The database url
     */
    DATABASE_URL: z.string().optional(),

    /**
     * Search engine
     */
    SEARCH_ENGINE: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                return val.toLowerCase();
            }
            return val;
        },
        z.enum(["youtube", "youtubemusic", "soundcloud", "spotify", "apple", "deezer", "yandex", "jiosaavn"]).default("youtube"),
    ),
    /**
     * Node in json
     */
    NODES: z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val), z.array(LavalinkNodeSchema)),
    /**
     * Genius api
     */
    GENIUS_API: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

/**
 * The environment variables
 */
export const env: Env = envSchema.parse(process.env);

for (const key in env) {
    if (!(key in env)) {
        throw new Error(`Missing env variable: ${key}`);
    }
}

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
