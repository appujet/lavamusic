import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/index.js';
export default class Speed extends Command {
    constructor(client) {
        super(client, {
            name: 'speed',
            description: {
                content: 'Sets the speed of the song',
                examples: ['speed 1.5'],
                usage: 'speed <number>',
            },
            category: 'filters',
            aliases: ['speed'],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
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
            options: [
                {
                    name: 'speed',
                    description: 'The speed you want to set',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                },
            ],
        });
    }
    async run(client, ctx, args) {
        const player = client.queue.get(ctx.guild.id);
        const speed = Number(args[0]);
        if (isNaN(speed))
            return ctx.sendMessage({
                embeds: [
                    {
                        description: 'Please provide a valid number',
                        color: client.color.red,
                    },
                ],
            });
        if (speed < 0.5 || speed > 5)
            return ctx.sendMessage({
                embeds: [
                    {
                        description: 'Please provide a number between 0.5 and 5',
                        color: client.color.red,
                    },
                ],
            });
        player.player.setTimescale({ speed: speed });
        return ctx.sendMessage({
            embeds: [
                {
                    description: `Speed has been set to ${speed}`,
                    color: client.color.main,
                },
            ],
        });
    }
}
//# sourceMappingURL=Speed.js.map