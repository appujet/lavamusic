import { ApplicationCommandOptionType } from 'discord.js';
import { LoadType } from 'shoukaku';

import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Add extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'add',
            description: {
                content: 'Adds a song to the playlist',
                examples: ['add <playlist> <song>'],
                usage: 'add <playlist> <song>',
            },
            category: 'playlist',
            aliases: ['add'],
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
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: 'playlist',
                    description: 'The playlist you want to add',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'song',
                    description: 'The song you want to add',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const playlist = args[0];
        const song = args[1];

        if (!playlist)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: 'Please provide a playlist',
                        color: client.color.red,
                    },
                ],
            });

        if (!song)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: 'Please provide a song',
                        color: client.color.red,
                    },
                ],
            });

        const playlistData = await client.db.getPLaylist(ctx.author.id, playlist);

        if (!playlistData)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: 'That playlist doesn\'t exist',
                        color: client.color.red,
                    },
                ],
            });

        const res = await client.queue.search(song);
        if (!res)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: 'No songs found',
                        color: client.color.red,
                    },
                ],
            });
        let trackStrings;
        let count;
        if (res.loadType === LoadType.PLAYLIST) {
            trackStrings = res.data.tracks.map(track => track);
            count = res.data.tracks.length;
        } else {
            trackStrings = [res.data[0]];
            count = 1;
        }
        client.db.addSong(ctx.author.id, playlist, trackStrings);

        ctx.sendMessage({
            embeds: [
                {
                    description: `Added ${count} to ${playlistData.name}`,
                    color: client.color.green,
                },
            ],
        });
    }
}
