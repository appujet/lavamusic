import Command from "../../structures/Command.js";

export default class SkipTo extends Command {
    constructor(client) {
        super(client, {
            name: "skipto",
            description: {
                content: "Skip to a specific song in the queue",
                usage: "<number>",
                examples: ["1"]
            },
            aliases: ["st"],
            category: "music",
            cooldown: 3,
            args: true,
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
            slashCommand: true,
            options: [
                {
                    name: "number",
                    description: "The number of the song in the queue",
                    type: 4,
                    required: true
                }
            ]
        });
    }
    async run(ctx, args) {
        const player = this.client.manager.getPlayer(ctx.guild.id);
        const embed = this.client.embed();
        if (args[0] > player.queue.length) {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription("The number you provided is greater than the queue length")] });
        }
        if (args[0] < 1) {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription("The number you provided is less than 1")] });
        }
        player.skip(args[0] - 1);
        return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription(`Skipped to **${track.info.title}**`)] });
    }
}