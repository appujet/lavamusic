import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class BassBoost extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'getfucked',
            description: {
                content: 'fuck you kiwi',
                examples: ['getfucked'],
                usage: 'getfucked',
            },
            category: 'filters',
            aliases: ['gf'],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: true,
                active: true,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: ['ManageGuild'],
            },
            slashCommand: true,
        });
    }
    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        if (player.filters.includes('getfucked')) {
            if (ctx.author.id == '139868888300126208') {
                ctx.sendMessage({
                    embeds: [
                        {
                            description: 'Get FUCKED, Kiwi.',
                            color: client.color.red,
                        },
                    ],
                });
            } else {
                player.filters.splice(player.filters.indexOf('getfucked'), 1);
            }
        } else {
            player.filters.push('getfucked');
            ctx.sendMessage({
                embeds: [
                    {
                        description: 'Oh you are absolutely FUCKED, Kiwi.',
                        color: client.color.main,
                    },
                ],
            });
        }
    }
}
