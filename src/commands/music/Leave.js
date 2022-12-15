import Command from "../../structures/Command.js";


export default class Leave extends Command {
    constructor(client) {
        super(client, {
            name: "leave",
            description: {
                content: "Leaves the voice channel.",
                usage: "leave",
                examples: ["leave"]
            },
            category: "music",
            aliases: ["l", "dc", "disconnect"],
            cooldown: 3,
            args: false,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: []
            },
            player: {
                voice: true,
                dj: false,
                active: false,
                djPerm: null
            },
            slashCommand: true
        });
    }

    async run(ctx, args) {
        const player = this.client.manager.getPlayer(ctx.guild.id);
        const embed = this.client.embed();

        if (player) {
            player.destroy();
            return ctx.sendMessage({
                embeds: [embed.setColor(this.client.color.default).setDescription(`**Left the voice channel.**\nThank you for using ${this.client.user.username}`)]
            });
        } else {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription("I'm not connected to any voice channel")] });
        }
    }
};