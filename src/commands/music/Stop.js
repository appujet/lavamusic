import Command from "../../structures/Command.js";

export default class Stop extends Command {
    constructor(client) {
        super(client, {
            name: "stop",
            description: {
                content: "Stop the current song",
                usage: "stop",
                examples: ["stop"],
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
        
        player.stop();
        return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription(`Stopped [${player.current.info.title}](${player.current.info.uri}).`)] });

    }
}