import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class BassBoost extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'bassboost',
            description: {
                content: 'on/off bassboost filter',
                examples: ['bassboost'],
                usage: 'bassboost',
            },
            category: 'filters',
            aliases: ['bb'],
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
        
        if (player.filters.includes('bassboost')) {
            player.player.setEqualizer([]);
            player.filters.splice(player.filters.indexOf('bassboost'), 1);
            ctx.sendMessage({
                embeds: [
                    {
                        description: 'Bassboost filter has been disabled',
                        color: client.color.main,
                    },
                ],
            });
        } else {
            player.player.setEqualizer([
                { band: 0, gain: 0.34 },
                { band: 1, gain: 0.34 },
                { band: 2, gain: 0.34 },
                { band: 3, gain: 0.34 },
            ]);
            player.filters.push('bassboost');
            ctx.sendMessage({
                embeds: [
                    {
                        description: 'Bassboost filter has been enabled',
                        color: client.color.main,
                    },
                ],
            });
        }
    }
}
