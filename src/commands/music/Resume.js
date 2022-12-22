import Command from "../../structures/Command.js";

export default class Resume extends Command {
    constructor(client) {
        super(client, {
            name: "resume",
            description: {
                content: "Resume the current song",
                usage: "",
                examples: [""]
            },
            aliases: ["r"],
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
        if (!player.paused) {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription("The player is already playing")] });
        }
        player.pause(false);
        return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription("Resumed the player")] });
    }
}