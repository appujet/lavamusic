import { LoadType } from "shoukaku";
import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class PlayNext extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "playnext",
            description: {
                content: "cmd.playnext.description",
                examples: [
                    "playnext example",
                    "playnext https://www.youtube.com/watch?v=example",
                    "playnext https://open.spotify.com/track/example",
                    "playnext http://www.example.com/example.mp3",
                ],
                usage: "playnext <song>",
            },
            category: "music",
            aliases: ["pn"],
            cooldown: 3,
            args: true,
            vote: false,
            player: {
                voice: true,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks", "Connect", "Speak"],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "song",
                    description: "cmd.playnext.options.song",
                    type: 3,
                    required: true,
                    autocomplete: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const query = args.join(" ");
        let player = client.queue.get(ctx.guild!.id);
        const vc = ctx.member as any;
        if (!player) player = await client.queue.create(ctx.guild, vc.voice.channel, ctx.channel);
        await ctx.sendDeferMessage(ctx.locale("cmd.playnext.loading"));
        const res = await this.client.queue.search(query);
        const embed = this.client.embed();
        switch (res.loadType) {
            case LoadType.ERROR:
                ctx.editMessage({
                    embeds: [embed.setColor(this.client.color.red).setDescription(ctx.locale("cmd.playnext.errors.search_error"))],
                });
                break;
            case LoadType.EMPTY:
                ctx.editMessage({
                    embeds: [embed.setColor(this.client.color.red).setDescription(ctx.locale("cmd.playnext.errors.no_results"))],
                });
                break;
            case LoadType.TRACK: {
                const track = player.buildTrack(res.data, ctx.author);
                if (player.queue.length > client.config.maxQueueSize)
                    return await ctx.editMessage({
                        embeds: [
                            embed
                                .setColor(this.client.color.red)
                                .setDescription(
                                    ctx.locale("cmd.playnext.errors.queue_too_long", { maxQueueSize: client.config.maxQueueSize }),
                                ),
                        ],
                    });
                player.queue.splice(0, 0, track);
                await player.isPlaying();
                ctx.editMessage({
                    embeds: [
                        embed
                            .setColor(this.client.color.main)
                            .setDescription(
                                ctx.locale("cmd.playnext.added_to_play_next", { title: res.data.info.title, uri: res.data.info.uri }),
                            ),
                    ],
                });
                break;
            }
            case LoadType.PLAYLIST: {
                if (res.data.tracks.length > client.config.maxPlaylistSize)
                    return await ctx.editMessage({
                        embeds: [
                            embed
                                .setColor(this.client.color.red)
                                .setDescription(
                                    ctx.locale("cmd.playnext.errors.playlist_too_long", { maxPlaylistSize: client.config.maxPlaylistSize }),
                                ),
                        ],
                    });
                for (const track of res.data.tracks) {
                    const pl = player.buildTrack(track, ctx.author);
                    if (player.queue.length > client.config.maxQueueSize)
                        return await ctx.editMessage({
                            embeds: [
                                embed
                                    .setColor(this.client.color.red)
                                    .setDescription(
                                        ctx.locale("cmd.playnext.errors.queue_too_long", { maxQueueSize: client.config.maxQueueSize }),
                                    ),
                            ],
                        });
                    player.queue.splice(0, 0, pl);
                }
                await player.isPlaying();
                ctx.editMessage({
                    embeds: [
                        embed
                            .setColor(this.client.color.main)
                            .setDescription(ctx.locale("cmd.playnext.added_playlist_to_play_next", { length: res.data.tracks.length })),
                    ],
                });
                break;
            }
            case LoadType.SEARCH: {
                const track1 = player.buildTrack(res.data[0], ctx.author);
                if (player.queue.length > client.config.maxQueueSize)
                    return await ctx.editMessage({
                        embeds: [
                            embed
                                .setColor(this.client.color.red)
                                .setDescription(
                                    ctx.locale("cmd.playnext.errors.queue_too_long", { maxQueueSize: client.config.maxQueueSize }),
                                ),
                        ],
                    });
                player.queue.splice(0, 0, track1);
                await player.isPlaying();
                ctx.editMessage({
                    embeds: [
                        embed
                            .setColor(this.client.color.main)
                            .setDescription(
                                ctx.locale("cmd.playnext.added_to_play_next", { title: res.data[0].info.title, uri: res.data[0].info.uri }),
                            ),
                    ],
                });
                break;
            }
        }
    }

    public async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();

        // Search for songs based on the focused value
        const res = await this.client.queue.search(focusedValue);
        const songs = [];

        if (res.loadType === LoadType.SEARCH && res.data.length) {
            res.data.slice(0, 10).forEach((x) => {
                songs.push({
                    name: `${x.info.title} by ${x.info.author}`,
                    value: x.info.uri,
                });
            });
        }

        // Respond with the song suggestions
        await interaction.respond(songs).catch(console.error);
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
