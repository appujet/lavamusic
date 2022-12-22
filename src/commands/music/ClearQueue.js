import Command from "../../structures/Command.js";


export default class ClearQueue extends Command {
    constructor(client) {
        super(client, {
            name: "clearqueue",
            description: {
                content: "Clear the queue",
                usage: "",
                examples: [""]
            },
            aliases: ["cq"],
            category: "music",
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
                active: true,
                djPerm: null
            },
            slashCommand: true
        });
    }
    async run(ctx) {
        const player = this.client.manager.getPlayer(ctx.guild.id);
        const embed = this.client.embed();
        if (player.queue.length === 0) {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription("The queue is already empty")] });
        } else {
            player.queue = [];
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription("Cleared the queue")] });
        }
    }
}