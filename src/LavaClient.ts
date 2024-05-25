import { ClientOptions, GatewayIntentBits } from 'discord.js';

import config from './config.js';
import Lavamusic from './structures/Lavamusic.js';

const {
    GuildMembers,
    MessageContent,
    GuildVoiceStates,
    GuildMessages,
    Guilds,
    GuildMessageTyping,
} = GatewayIntentBits;

const clientOptions: ClientOptions = {
    intents: [
        Guilds,
        GuildMessages,
        MessageContent,
        GuildVoiceStates,
        GuildMembers,
        GuildMessageTyping,
    ],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: false },
};

const client = new Lavamusic(clientOptions);
client.start(config.token);

/**
 * Project: lavamusic
 * Author: Appu
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
