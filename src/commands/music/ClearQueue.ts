import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class ClearQueue extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'clearqueue',
            description: {
                content: 'Clears the queue',
                examples: ['clearqueue'],
                usage: 'clearqueue',
            },
            category: 'music',
            aliases: ['cq'],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: true,
                active: true,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }
    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();
        if (!player.queue.length)
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.red)
                        .setDescription('There are no songs in the queue.'),
                ],
            });
        player.queue = [];

        return await ctx.sendMessage({
            embeds: [embed.setColor(this.client.color.main).setDescription(`Cleared the queue`)],
        });
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
