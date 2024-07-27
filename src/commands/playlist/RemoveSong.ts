import { LoadType } from "shoukaku";
import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class RemoveSong extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "removesong",
            description: {
                content: "Removes a song from the playlist",
                examples: ["removesong <playlist> <song>"],
                usage: "removesong <playlist> <song>",
            },
            category: "playlist",
            aliases: ["rs"],
            cooldown: 3,
            args: true,
            vote: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "playlist",
                    description: "The playlist you want to remove from",
                    type: 3,
                    required: true,
                },
                {
                    name: "song",
                    description: "The song you want to remove",
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const playlist = args.shift();
        const song = args.join(" ");

        if (!playlist) {
            const errorMessage = this.client.embed().setDescription("[Please provide a playlist]").setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [errorMessage] });
        }

        if (!song) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: "[Please provide a song]",
                        color: this.client.color.red,
                    },
                ],
            });
        }

        const playlistData = await client.db.getPlaylist(ctx.author.id, playlist);

        if (!playlistData) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: "[That playlist doesn't exist]",
                        color: this.client.color.red,
                    },
                ],
            });
        }

        const res = await client.queue.search(song);

        if (!res || res.loadType !== LoadType.TRACK) {
            const noSongsFoundError = this.client.embed().setDescription("[No matching song found]").setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [noSongsFoundError] });
        }

        const trackToRemove = res.data;

        try {
            await client.db.removeSong(ctx.author.id, playlist, trackToRemove.encoded);
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: `[Removed ${trackToRemove.info.title} from ${playlistData.name}]`,
                        color: this.client.color.green,
                    },
                ],
            });
        } catch (error) {
            console.error(error);
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: "[An error occurred while removing the song]",
                        color: this.client.color.red,
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
