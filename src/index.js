import { BotClient } from "./structures/Client.js";
import { WebhookClient, EmbedBuilder } from 'discord.js';

const client = new BotClient();
const int = async () => {

    (async () => await client.start())();
};
int();

export default client;