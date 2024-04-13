import { ApplicationCommandOptionType } from 'discord.js';

import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Create extends Command {
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
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const name = args.join(' ').replace(/\s/g, '');
        if (name.length > 50)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: 'Playlist names can only be 50 characters long',
                        color: client.color.red,
                    },
                ],
            });
        const playlist = await client.db.getPLaylist(ctx.author.id, name);
        if (playlist)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: 'A playlist with that name already exists',
                        color: client.color.main,
                    },
                ],
            });
        client.db.createPlaylist(ctx.author.id, name);
        return await ctx.sendMessage({
            embeds: [
                {
                    description: `Playlist **${name}** has been created`,
                    color: client.color.main,
                },
            ],
        });
    }
}
