import { Command } from '../../structures/index.js';
export default class Nowplaying extends Command {
    constructor(client) {
        super(client, {
            name: 'nowplaying',
            description: {
                content: 'Shows the currently playing song',
                examples: ['nowplaying'],
                usage: 'nowplaying',
            },
            category: 'music',
            aliases: ['np'],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: false,
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
    async run(client, ctx, args) {
        const player = client.queue.get(ctx.guild.id);
        const track = player.current;
        const position = player.player.position;
        const duration = track.info.length;
        const bar = client.utils.progressBar(position, duration, 20);
        const embed1 = this.client
            .embed()
            .setColor(this.client.color.main)
            .setAuthor({ name: 'Now Playing', iconURL: ctx.guild.iconURL({}) })
            .setThumbnail(track.info.thumbnail)
            .setDescription(`[${track.info.title}](${track.info.uri}) - Request By: ${track.info.requester}\n\n\`${bar}\``)
            .addFields({
            name: '\u200b',
            value: `\`${client.utils.formatTime(position)} / ${client.utils.formatTime(duration)}\``,
        });
        return ctx.sendMessage({ embeds: [embed1] });
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
//# sourceMappingURL=Nowplaying.js.map