import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class LoadPlaylist extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "load",
            description: {
                content: "cmd.load.description",
                examples: ["load <playlist>"],
                usage: "load <playlist>",
            },
            category: "playlist",
            aliases: ["lo"],
            cooldown: 3,
            args: true,
            vote: true,
            player: {
                voice: true,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "playlist",
                    description: "cmd.load.options.playlist",
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        let player = client.queue.get(ctx.guild!.id);
        const playlistName = args.join(" ").trim();
        const playlistData = await client.db.getPlaylist(ctx.author.id, playlistName);
        if (!playlistData) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.load.messages.playlist_not_exist"),
                        color: this.client.color.red,
                    },
                ],
            });
        }

        const songs = await client.db.getSongs(ctx.author.id, playlistName);
        if (!songs.length) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.load.messages.playlist_empty"),
                        color: client.color.red,
                    },
                ],
            });
        }

        const vc = ctx.member as any;
        if (!player) {
            player = await client.queue.create(
                ctx.guild,
                vc.voice.channel,
                ctx.channel,
                client.shoukaku.options.nodeResolver(client.shoukaku.nodes),
            );
        }

        for (const song of songs) {
            const trackData = JSON.parse(song.track);
            for (const track of trackData) {
                const builtTrack = player.buildTrack(track, ctx.author as any);
                player.queue.push(builtTrack);
            }
        }

        await player.isPlaying();
        return await ctx.sendMessage({
            embeds: [
                {
                    description: ctx.locale("cmd.load.messages.playlist_loaded", { name: playlistData.name, count: songs.length }),
                    color: this.client.color.main,
                },
            ],
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
