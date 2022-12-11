import { BotClient } from "./structures/Client.js";
import { WebhookClient, EmbedBuilder } from 'discord.js';

const client = new BotClient();
const int = async () => {

    (async () => await client.start())();
};
int();
//const channel = new WebhookClient({ url: client.config.hooks.errors.url });
const color = 'Red';

client.on('disconnect', async () => {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle('Disconnected')
        .setTimestamp();
});
client.on('reconnecting', async () => {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle('Reconnecting')
        .setTimestamp();
});
client.on('error', async (err) => {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle('Error')
        .setDescription(`\`\`\`js
${err.stack}\`\`\``)
        .setTimestamp();
    client.logger.error(err.stack);
});
client.on('warn', async (err) => {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle('Warning')
        .setDescription(`\`\`\`js
${err.stack}\`\`\``)
        .setTimestamp();
    client.logger.error(err.stack);
});

process.on('uncaughtException', async (err, promise) => {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle('Uncaught Exception')
        .setDescription(`\`\`\`js
${err.stack}\`\`\``)
        .setTimestamp();
    client.logger.error(err.stack);
});

process.on('unhandledRejection', async (err, promise) => {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle('Unhandled Rejection')
        .setDescription(`\`\`\`js
${err.stack}\`\`\``)
        .setTimestamp();
    client.logger.error(err.stack);
});
export default client;