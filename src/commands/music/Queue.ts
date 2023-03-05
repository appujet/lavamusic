import { Command, Lavamusic, Context } from "../../structures/index.js";


export default class Queue extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "queue",
            description: {
                content: "Shows the current queue",
                examples: ["queue"],
                usage: "queue"
            },
            category: "music",
            aliases: ["q"],
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
        if (!player.queue.length) return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.red).setDescription("There are no songs in the queue.")] });
        const queue = player.queue.map((track, index) => `${index + 1}. [${track.info.title}](${track.info.uri}) - Request By: ${track?.info.requester} - Duration: ${track.info.isStream ? "LIVE" : this.client.utils.formatTime(track.info.length)}`); 

        let chunks = client.utils.chunk(queue, 10) as any
        if (chunks.length === 0) chunks = 1;
        const pages = [];
        for (let i = 0; i < chunks.length; i++) {
            const embed = this.client.embed()
                .setColor(this.client.color.main)
                .setAuthor({ name: "Queue", iconURL: ctx.guild.iconURL({}) })
                .setDescription(chunks[i].join("\n"))
                .setFooter({ text: `Page ${i + 1} of ${chunks.length}` })
            pages.push(embed);
        }
       
        return client.utils.paginate(ctx, pages);
    }
}