import Command from "../../structures/Command.js";
import { progressBar, formatTime } from "../../handlers/functions.js";


export default class Nowplaying extends Command {
    constructor(client) {
        super(client, {
            name: "nowplaying",
            description: {
                content: "Show the current song",
                usage: "nowplaying",
                examples: ["nowplaying"],
            },
            aliases: ["np"],
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
        
        const track = player.current;
        const position = player.player.position
        const duration = track.info.length;
        const bar = progressBar(position, duration, 20);
        const embed = this.client.embed()
            .setColor(this.client.color.default)
            .setAuthor({ name: "Now Playing", iconURL: ctx.guild.iconURL({ }) })
            .setDescription(`[${track.info.title}](${track.info.uri}) - Request By: ${track.requester}\n\n\`${bar}\``)
            .addFields({
                name: '\u200b',
                value: `\`${formatTime(position)} / ${formatTime(duration)}\``,
            })
        return ctx.sendMessage({ embeds: [embed] });
    }
}