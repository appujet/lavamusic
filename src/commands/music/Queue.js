import { chunk, formatTime, paginate } from "../../handlers/functions.js";
import Command from "../../structures/Command.js";


export default class Queue extends Command {
    constructor(client) {
        super(client, {
            name: "queue",
            description: {
                content: "Shows the queue",
                usage: "queue",
                examples: ["queue"]
            },
            aliases: ["q"],
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
    async run(ctx, args) {
        const player = this.client.manager.getPlayer(ctx.guild.id);
        const embed = this.client.embed();
        const track = player.current;
        
            if (!player.queue.length || player.queue.length === 0) {
      return ctx.sendMessage({
        embeds: [
          embed
            .setColor(this.client.color.default)
            .setDescription(
              `[${track.info.title}](${track.info.uri}) - Request By: ${
                player?.current.info.requester
              } - \`${formatTime(track.info.length)}\``
            ),
        ],
      });
    }
        
        const queus = player.queue.map((track, i) => {
            return `\`${i + 1}.\` [${track.info.title}](${track.info.uri}) - Request By: ${track?.requester} - \`${formatTime(track.info.length)}\``;
        });
        let chunks = chunk(queus, 10);
        if (chunks.length === 0) chunks = 1;
        const pages = [];
        for (let i = 0; i < chunks.length; i++) {
            const embed = this.client.embed()
                .setColor(this.client.color.default)
                .setAuthor({ name: "Queue", iconURL: ctx.guild.iconURL({ }) })
                .setDescription(chunks[i].join("\n"))
                .setFooter({text: `Page ${i + 1} of ${chunks.length}`})
            pages.push(embed);
        }
        return await paginate(ctx, pages);
    }
};
