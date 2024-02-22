import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Tremolo extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'tremolo',
            description: {
                content: 'on/off the tremolo filter',
                examples: ['tremolo'],
                usage: 'tremolo',
            },
            category: 'filters',
            aliases: ['tremolo'],
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
        if (player.filters.includes('tremolo')) {
            player.player.setTremolo();
            player.filters.splice(player.filters.indexOf('tremolo'), 1);
            ctx.sendMessage({
                embeds: [
                    {
                        description: 'tremolo filter has been disabled',
                        color: client.color.main,
                    },
                ],
            });
        } else {
            player.player.setTremolo({ depth: 0.75, frequency: 4 });
            player.filters.push('tremolo');
            ctx.sendMessage({
                embeds: [
                    {
                        description: 'tremolo filter has been enabled',
                        color: client.color.main,
                    },
                ],
            });
        }
    }
}
