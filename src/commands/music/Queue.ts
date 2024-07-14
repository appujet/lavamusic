import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Queue extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "queue",
            description: {
                content: "Shows the current queue",
                examples: ["queue"],
                usage: "queue",
            },
            category: "music",
            aliases: ["q"],
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
        const embed = this.client.embed();
        if (player.queue.length === 0) {
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.main)
                        .setDescription(
                            `Now playing: [${player.current.info.title}](${player.current.info.uri}) - Request By: ${
                                player.current?.info.requester
                            } - Duration: ${player.current.info.isStream ? "LIVE" : client.utils.formatTime(player.current.info.length)}`,
                        ),
                ],
            });
        }
        const songStrings = [];
        for (let i = 0; i < player.queue.length; i++) {
            const track = player.queue[i];
            songStrings.push(
                `${i + 1}. [${track.info.title}](${track.info.uri}) - Request By: ${track?.info.requester} - Duration: ${
                    track.info.isStream ? "LIVE" : client.utils.formatTime(track.info.length)
                }`,
            );
        }
        let chunks = client.utils.chunk(songStrings, 10);

        if (chunks.length === 0) chunks = [songStrings];

        const pages = chunks.map((chunk, index) => {
            return this.client.embed()
                .setColor(this.client.color.main)
                .setAuthor({ name: "Queue", iconURL: ctx.guild.iconURL({}) })
                .setDescription(chunk.join("\n"))
                .setFooter({ text: `Page ${index + 1} of ${chunks.length}` });
        });
        return await client.utils.paginate(ctx, pages);
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
