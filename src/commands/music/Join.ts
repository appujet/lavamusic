import { Command, Lavamusic, Context } from "../../structures/index.js";


export default class Join extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "join",
            description: {
                content: "Joins the voice channel",
                examples: ["join"],
                usage: "join"
            },
            category: "music",
            aliases: ["j"],
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

        let player = client.queue.get(ctx.guild.id) as any;
        const embed = this.client.embed();
        if (!player) {
            player = this.client.queue.create(ctx.guild, ctx.member, ctx.channel);
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.main).setDescription(`Joined <#${player.player.connection.channelId}>`)] });
        } else {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.main).setDescription(`I'm already connected to <#${player.player.connection.channelId}>`)] });
        }
    }
}