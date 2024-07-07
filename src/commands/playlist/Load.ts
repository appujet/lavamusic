import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class LoadPlaylist extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "load",
            description: {
                content: "Loads a playlist",
                examples: ["load <playlist>"],
                usage: "load <playlist>",
            },
            category: "playlist",
            aliases: [],
            cooldown: 3,
            args: true,
            player: {
                voice: true,
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
                    description: "The playlist you want to load",
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        let player = client.queue.get(ctx.guild.id);
        const playlist = args.join(" ").replace(/\s/g, "");
        const playlistData = await client.db.getPlaylist(ctx.author.id, playlist);
        if (!playlistData)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: "That playlist doesn't exist.",
                        color: this.client.color.red,
                    },
                ],
            });
        const songs = await client.db.getSongs(ctx.author.id, playlist);
        if (!songs.length)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: "That playlist is empty.",
                        color: client.color.red,
                    },
                ],
            });
        songs.map(async (s) => {
            for await (const song of JSON.parse(s.track)) {
                const vc = ctx.member as any;
                if (!player)
                    player = await client.queue.create(
                        ctx.guild,
                        vc.voice.channel,
                        ctx.channel,
                        client.shoukaku.options.nodeResolver(client.shoukaku.nodes),
                    );
                const track = player.buildTrack(song, ctx.author as any);
                player.queue.push(track);
                player.isPlaying();
            }
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: `Loaded \`${playlistData.name}\` with \`${JSON.parse(s.track).length}\` songs.`,
                        color: this.client.color.main,
                    },
                ],
            });
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
