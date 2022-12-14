import Command from "../../structures/Command.js";

export default class Skip extends Command {
    constructor(client) {
        super(client, {
            name: "skip",
            description: {
                content: "Skip the current song",
                usage: "skip",
                examples: ["skip"],
            },
            aliases: ["s"],
            category: "music",
            cooldown: 3,
            args: false,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            player: {
                voice: true,
                dj: false,
                active: true,
                djPerm: null,
            },
            slashCommand: true,
        });
    }
    async run(ctx, args) {
        const player = this.client.manager.getPlayer(ctx.guild.id);
        const embed = this.client.embed();

        if (player.queue.length < 1) {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription("There are no songs in the queue.")] });
        }
        player.skip();
        return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription(`Skipped [${player.current.info.title}](${player.current.info.uri}).`)] });

    }
}