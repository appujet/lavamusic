import { TextChannel } from 'discord.js';

import { Lavamusic } from '../structures/index.js';

export default class BotLog {
    public static send(client: Lavamusic, message: string, type: string): void {
        if (!client) return;
        if (!client.channels.cache) return;
        if (!client.config.logChannelId) return;
        const channel = client.channels.cache.get(client.config.logChannelId) as TextChannel;
        if (!channel) return;
        let color: string | number | readonly [red: number, green: number, blue: number];
        switch (type) {
            case 'error':
                color = 0xff0000;
                break;
            case 'warn':
                color = 0xffff00;
                break;
            case 'info':
                color = 0x00ff00;
                break;
            case 'success':
                color = 0x00ff00;
                break;
            default:
                color = 0x000000;
                break;
        }
        const embed = client.embed().setColor(color).setDescription(message).setTimestamp();

        channel.send({ embeds: [embed] }).catch(() => {
            null;
        });
    }
}
