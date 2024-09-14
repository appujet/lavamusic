import { type ClientOptions, GatewayIntentBits } from "discord.js";
import Lavamusic from "./structures/Lavamusic";
import { env } from "./env";

const { GuildMembers, MessageContent, GuildVoiceStates, GuildMessages, Guilds, GuildMessageTyping } = GatewayIntentBits;

const clientOptions: ClientOptions = {
    intents: [Guilds, GuildMessages, MessageContent, GuildVoiceStates, GuildMembers, GuildMessageTyping],
    allowedMentions: { parse: ["users", "roles"], repliedUser: false },
};

const client = new Lavamusic(clientOptions);
client.start(env.TOKEN);

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
