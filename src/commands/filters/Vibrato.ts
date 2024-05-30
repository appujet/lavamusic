import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Vibrato extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'vibrato',
            description: {
                content: 'on/off vibrato filter',
                examples: ['vibrato'],
                usage: 'vibrato',
            },
            category: 'filters',
            aliases: ['vb'],
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

        const vibratoEnabled = player.filters.includes('vibrato');

        if (vibratoEnabled) {
            player.player.setVibrato();
            player.filters.splice(player.filters.indexOf('vibrato'), 1);
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: 'Vibrato filter has been disabled',
                        color: client.color.main,
                    },
                ],
            });
        } else {
            player.player.setVibrato({ depth: 0.75, frequency: 4 });
            player.filters.push('vibrato');
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: 'Vibrato filter has been enabled',
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
