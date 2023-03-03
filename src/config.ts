import dotent from 'dotenv';
import { ColorResolvable } from 'discord.js';
dotent.config();

export default {
    token: process.env.TOKEN,
    prefix: process.env.PREFIX,
    color: process.env.COLOR as ColorResolvable,
    owners: process.env.OWNERS?.split(','),
    database: process.env.DATABASE_URL,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    production: process.env.PRODUCTION === 'true',

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