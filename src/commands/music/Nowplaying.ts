import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Nowplaying extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "nowplaying",
            description: {
                content: "Shows the currently playing song",
                examples: ["nowplaying"],
                usage: "nowplaying",
            },
            category: "music",
            aliases: ["np"],
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
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        const track = player.current;
        const position = player.player.position;
        const duration = track.info.length;
        const bar = client.utils.progressBar(position, duration, 20);

        const embed = this.client
            .embed()
            .setColor(this.client.color.main)
            .setAuthor({ name: "Now Playing", iconURL: ctx.guild.iconURL({}) })
            .setThumbnail(track.info.artworkUrl)
            .setDescription(`[${track.info.title}](${track.info.uri}) - Requested by: ${track.info.requester}\n\n\`${bar}\``)
            .addFields({
                name: "\u200b",
                value: `\`${client.utils.formatTime(position)} / ${client.utils.formatTime(duration)}\``,
            });

        return await ctx.sendMessage({ embeds: [embed] });
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
