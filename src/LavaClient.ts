import "reflect-metadata"
import { Client, type ClientOptions, GatewayIntentBits } from 'discord.js';
import { env } from './env';
import Lavamusic from './structures/Lavamusic';
import { container } from 'tsyringe';


const { GuildMembers, MessageContent, GuildVoiceStates, GuildMessages, Guilds, GuildMessageTyping } = GatewayIntentBits;

const clientOptions: ClientOptions = {
	intents: [Guilds, GuildMessages, MessageContent, GuildVoiceStates, GuildMembers, GuildMessageTyping],
	allowedMentions: { parse: ['users', 'roles'], repliedUser: false },
};

const client = new Lavamusic(clientOptions);

client.setMaxListeners(20);
container.register(Client, { useValue: client });

client.start(env.TOKEN);
client.api.init();
client.socket.init();

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
