import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class NightCore extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'nightcore',
            description: {
                content: 'Toggle the nightcore filter on/off',
                examples: ['nightcore'],
                usage: 'nightcore',
            },
            category: 'filters',
            aliases: ['nc'],
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

        const filterEnabled = player.filters.includes('nightcore');

        if (filterEnabled) {
            player.player.setTimescale();
            player.filters = player.filters.filter(filter => filter !== 'nightcore');
            ctx.sendMessage({
                embeds: [
                    {
                        description: 'Nightcore filter has been disabled',
                        color: client.color.main,
                    },
                ],
            });
        } else {
            player.player.setTimescale({ speed: 1.165, pitch: 1.125, rate: 1.05 });
            player.filters.push('nightcore');
            ctx.sendMessage({
                embeds: [
                    {
                        description: 'Nightcore filter has been enabled',
                        color: client.color.main,
                    },
                ],
            });
        }
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
