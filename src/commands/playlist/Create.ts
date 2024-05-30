import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class CreatePlaylist extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'create',
            description: {
                content: 'Creates a playlist',
                examples: ['create <name>'],
                usage: 'create <name>',
            },
            category: 'playlist',
            aliases: ['create'],
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
                    name: 'name',
                    description: 'The name of the playlist',
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const name = args.join(' ').trim();
        if (name.length > 50) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: 'Playlist names can only be 50 characters long',
                        color: this.client.color.red,
                    },
                ],
            });
        }
        const playlistExists = await client.db.getPlaylist(ctx.author.id, name);
        if (playlistExists) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: 'A playlist with that name already exists',
                        color: this.client.color.main,
                    },
                ],
            });
        }
        client.db.createPlaylist(ctx.author.id, name);
        return await ctx.sendMessage({
            embeds: [
                {
                    description: `Playlist **${name}** has been created`,
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
