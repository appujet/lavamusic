import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class NightCore extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'nightcore',
            description: {
                content: 'on/off nightcore filter',
                examples: ['nightcore'],
                usage: 'nightcore',
            },
            category: 'filters',
            aliases: ['nc'],
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
                user: [],
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
        if (player.filters.includes('nightcore')) {
            player.player.setTimescale();
            player.filters.splice(player.filters.indexOf('nightcore'), 1);
            ctx.sendMessage({
                embeds: [
                    {
                        description: 'Nightcore filter has been disabled',
                        color: client.color.main,
                    },
                ],
            });
        } else {
            player.player.setTimescale({ speed: 1.165, pitch: 1.125, rate: 1.05 });
            player.filters.push('nightcore');
            ctx.sendMessage({
                embeds: [
                    {
                        description: 'Nightcore filter has been enabled',
                        color: client.color.main,
                    },
                ],
            });
        }
    }
}
