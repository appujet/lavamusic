import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Reset extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'reset',
            description: {
                content: 'Resets the active filters',
                examples: ['reset'],
                usage: 'reset',
            },
            category: 'filters',
            aliases: ['reset'],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: true,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: ['ManageGuild'],
            },
            slashCommand: true,
            options: [],
        });
    }
    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        if (player.filters.includes('getfucked') && ctx.author.id == '139868888300126208') {
            ctx.sendMessage({
                embeds: [
                    {
                        description: 'Get FUCKED, Kiwi.',
                        color: client.color.red,
                    },
                ],
            });
            return;
        }
        player.player.clearFilters();
        player.filters = [];
        return await ctx.sendMessage({
            embeds: [
                {
                    description: 'Filters have been reset',
                    color: client.color.main,
                },
            ],
        });
    }
}
