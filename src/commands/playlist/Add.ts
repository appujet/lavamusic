import { LoadType } from "shoukaku";

import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class AddPlaylist extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "add",
            description: {
                content: "Adds a song to the playlist",
                examples: ["add <playlist> <song>"],
                usage: "add <playlist> <song>",
            },
            category: "playlist",
            aliases: ["a"],
            cooldown: 3,
            args: true,
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
                    description: "The playlist you want to add",
                    type: 3,
                    required: true,
                },
                {
                    name: "song",
                    description: "The song you want to add",
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
            const errorMessage = this.client.embed().setDescription("Please provide a playlist").setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [errorMessage] });
        }

        if (!song) {
            const errorMessage = this.client.embed().setDescription("Please provide a song").setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [errorMessage] });
        }

        const playlistData = await client.db.getPlaylist(ctx.author.id, playlist);

        if (!playlistData) {
            const playlistNotFoundError = this.client.embed().setDescription("That playlist doesn't exist").setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [playlistNotFoundError] });
        }

        const res = await client.queue.search(song);
        if (!res) {
            const noSongsFoundError = this.client.embed().setDescription("No songs found").setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [noSongsFoundError] });
        }
        let trackStrings: any;
        let count: number;
        if (res.loadType === LoadType.PLAYLIST) {
            trackStrings = res.data.tracks;
            count = res.data.tracks.length;
        } else if (res.loadType === LoadType.TRACK) {
            trackStrings = [res.data];
            count = 1;
        }
        client.db.addSong(ctx.author.id, playlist, trackStrings);

        const successMessage = this.client
            .embed()
            .setDescription(`Added ${count} song(s) to ${playlistData.name}`)
            .setColor(this.client.color.green);
        ctx.sendMessage({ embeds: [successMessage] });
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
