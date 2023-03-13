import { Command, Lavamusic, Context } from "../../structures/index.js";


export default class Autoplay extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "autoplay",
            description: {
                content: "Toggles autoplay",
                examples: ["autoplay"],
                usage: "autoplay"
            },
            category: "music",
            aliases: ["ap"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: true,
                active: true,
                djPerm: null
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: []
            },
            slashCommand: true,
            options: []
        });
    };
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {

        const player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();

        const autoplay = player.autoplay;
        player.autoplay = !autoplay;

        return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.main).setDescription(`Autoplay has been ${autoplay ? "disabled" : "enabled"}`)] });
    }
}