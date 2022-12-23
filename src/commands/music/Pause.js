import Command from "../../structures/Command.js";

export default class Pause extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            description: {
                content: 'Pause the current song.',
                usage: '',
                examples: [''],
            },
            category: 'music',
            cooldown: 3,
            args: false,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            player: {
                voice: true,
                dj: false,
                active: true,
                djPerm: null,
            },
            slashCommand: true,
            options: []
        });
    }
    async run(ctx, args) {
        const player = this.client.manager.getPlayer(ctx.guild.id);
        const embed = this.client.embed();
        if (player.paused) {
            ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription('The player is already paused.')] });
        } else {
            player.pause();
            ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription('Paused the player.')] });
        }
    }
}