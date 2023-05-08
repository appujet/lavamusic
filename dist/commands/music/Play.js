import { Command } from '../../structures/index.js';
export default class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            description: {
                content: 'Plays a song from YouTube or Spotify',
                examples: [
                    'play https://www.youtube.com/watch?v=QH2-TGUlwu4',
                    'play https://open.spotify.com/track/6WrI0LAC5M1Rw2MnX2ZvEg',
                ],
                usage: 'play <song>',
            },
            category: 'music',
            aliases: ['p'],
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
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks', 'Connect', 'Speak'],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: 'song',
                    description: 'The song you want to play',
                    type: 3,
                    required: true,
                    autocomplete: true,
                },
            ],
        });
    }
    async run(client, ctx, args) {
        const query = args.join(' ');
        let player = client.queue.get(ctx.guild.id);
        const vc = ctx.member;
        if (!player)
            player = await client.queue.create(ctx.guild, vc.voice.channel, ctx.channel, client.shoukaku.getNode());
        const res = await this.client.queue.search(query);
        const embed = this.client.embed();
        switch (res.loadType) {
            case 'LOAD_FAILED':
                ctx.sendMessage({
                    embeds: [embed.setColor(this.client.color.red).setDescription('There was an error while searching.')],
                });
                break;
            case 'NO_MATCHES':
                ctx.sendMessage({
                    embeds: [embed.setColor(this.client.color.red).setDescription('There were no results found.')],
                });
                break;
            case 'TRACK_LOADED':
                const track = player.buildTrack(res.tracks[0], ctx.author);
                if (player.queue.length > client.config.maxQueueSize)
                    return ctx.sendMessage({
                        embeds: [
                            embed
                                .setColor(this.client.color.red)
                                .setDescription(`The queue is too long. The maximum length is ${client.config.maxQueueSize} songs.`),
                        ],
                    });
                player.queue.push(track);
                await player.isPlaying();
                ctx.sendMessage({
                    embeds: [
                        embed
                            .setColor(this.client.color.main)
                            .setDescription(`Added [${res.tracks[0].info.title}](${res.tracks[0].info.uri}) to the queue.`),
                    ],
                });
                break;
            case 'PLAYLIST_LOADED':
                if (res.length > client.config.maxPlaylistSize)
                    return ctx.sendMessage({
                        embeds: [
                            embed
                                .setColor(this.client.color.red)
                                .setDescription(`The playlist is too long. The maximum length is ${client.config.maxPlaylistSize} songs.`),
                        ],
                    });
                for (const track of res.tracks) {
                    const pl = player.buildTrack(track, ctx.author);
                    if (player.queue.length > client.config.maxQueueSize)
                        return ctx.sendMessage({
                            embeds: [
                                embed
                                    .setColor(this.client.color.red)
                                    .setDescription(`The queue is too long. The maximum length is ${client.config.maxQueueSize} songs.`),
                            ],
                        });
                    player.queue.push(pl);
                }
                await player.isPlaying();
                ctx.sendMessage({
                    embeds: [
                        embed.setColor(this.client.color.main).setDescription(`Added ${res.tracks.length} songs to the queue.`),
                    ],
                });
                break;
            case 'SEARCH_RESULT':
                const track1 = player.buildTrack(res.tracks[0], ctx.author);
                if (player.queue.length > client.config.maxQueueSize)
                    return ctx.sendMessage({
                        embeds: [
                            embed
                                .setColor(this.client.color.red)
                                .setDescription(`The queue is too long. The maximum length is ${client.config.maxQueueSize} songs.`),
                        ],
                    });
                player.queue.push(track1);
                await player.isPlaying();
                ctx.sendMessage({
                    embeds: [
                        embed
                            .setColor(this.client.color.main)
                            .setDescription(`Added [${res.tracks[0].info.title}](${res.tracks[0].info.uri}) to the queue.`),
                    ],
                });
                break;
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
//# sourceMappingURL=Play.js.map