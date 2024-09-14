import { Command, type Context, type Lavamusic } from "../../structures/index";

export default class Nowplaying extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "nowplaying",
            description: {
                content: "cmd.nowplaying.description",
                examples: ["nowplaying"],
                usage: "nowplaying",
            },
            category: "music",
            aliases: ["np"],
            cooldown: 3,
            args: false,
            vote: false,
            player: {
                voice: true,
                dj: false,
                active: true,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.manager.getPlayer(ctx.guild!.id);
        const track = player.queue.current!;
        const position = player.position;
        const duration = track.info.duration;
        const bar = client.utils.progressBar(position, duration, 20);

        const embed = this.client
            .embed()
            .setColor(this.client.color.main)
            .setAuthor({
                name: ctx.locale("cmd.nowplaying.now_playing"),
                iconURL: ctx.guild?.iconURL({})!,
            })
            .setThumbnail(track.info.artworkUrl!)
            .setDescription(
                ctx.locale("cmd.nowplaying.track_info", {
                    title: track.info.title,
                    uri: track.info.uri,
                    requester: (track.requester as any).id,
                    bar: bar,
                }),
            )
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
