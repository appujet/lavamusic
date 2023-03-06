import { Command, Lavamusic, Context } from "../../structures/index.js";


export default class Leave extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "leave",
            description: {
                content: "Leaves the voice channel",
                examples: ["leave"],
                usage: "leave"
            },
            category: "music",
            aliases: ["l"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: false,
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

        ctx.sendMessage({ embeds: [embed.setColor(this.client.color.main).setDescription(`Left <#${player.player.connection.channelId}>`)] });
        player.destroy();
    }
}