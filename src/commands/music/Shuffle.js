import Command from "../../structures/Command.js";

export default class Shuffle extends Command {
    constructor(client) {
        super(client, {
            name: "shuffle",
            description: {
                content: "Shuffle the queue",
                usage: "",
                examples: [""]
            },
            aliases: ["sh"],
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
        if (player.queue.length < 2) {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription("The queue is too short to shuffle")] });
        }
        if (!player.shuffle) {
            player.setShuffle(true);
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription("Shuffled the queue")] });
        } else {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription("The queue is already shuffled")] });
        }
    }
}