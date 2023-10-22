import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Join extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'join',
            description: {
                content: 'Joins the voice channel',
                examples: ['join'],
                usage: 'join',
            },
            category: 'music',
            aliases: ['j'],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: false,
                active: false,
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
        let player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();
        if (!player) {
            const vc = ctx.member as any;
            player = await client.queue.create(
                ctx.guild,
                vc.voice.channel,
                ctx.channel,
                client.shoukaku.getNode()
            );
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.main)
                        .setDescription(`Joined <#${player.player.connection.channelId}>`),
                ],
            });
        } else {
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.main)
                        .setDescription(
                            `I'm already connected to <#${player.player.connection.channelId}>`
                        ),
                ],
            });
        }
    }
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
