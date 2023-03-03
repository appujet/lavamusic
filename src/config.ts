import dotent from 'dotenv';
dotent.config();

const Config = (): IConfig => {
    return {
        TOKEN: process.env.TOKEN,
        PREFIX: process.env.PREFIX,
        OWNER_IDS: process.env.OWNER_IDS?.split(','), // e.g. "1234567890,0987654321"
        CLIENT_ID: process.env.CLIENT_ID,
        GUILD_ID: process.env.GUILD_ID,
        PRODUCTION: process.env.PRODUCTION === 'true',
        DATABASE_URL: process.env.DATABASE_URL,
        COLOR : process.env.COLOR
    };
};

interface IConfig {
    TOKEN: string | undefined;
    PREFIX: string | undefined;
    OWNER_IDS: string[] | undefined; // Array of owner ids
    CLIENT_ID: string | undefined;
    GUILD_ID: string | undefined;
    PRODUCTION: boolean | undefined;
    DATABASE_URL: string | undefined;
    COLOR: string | undefined;
};

export {
    Config,
    IConfig
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