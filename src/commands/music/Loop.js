import Command from "../../structures/Command.js";

export default class Loop extends Command {
    constructor(client) {
        super(client, {
            name: "loop",
            description: {
                content: "Loop the current song",
                usage: "",
                examples: [""]
            },
            aliases: ["l"],
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
        if (player.loop === "off") {
            player.loop = "repeat";
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription("Looped the current song")] });
        } else if (player.loop === "repeat") {
            player.loop = "queue";
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription("Looped the queue")] });
        } else if (player.loop === "queue") {
            player.loop = "off";
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription("Disabled loop")] });
        }
    }
}