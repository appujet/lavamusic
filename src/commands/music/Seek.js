import Command from "../../structures/Command.js";
import { stringToTime } from "../../handlers/functions.js";


export default class Seek extends Command {
    constructor(client) {
        super(client, {
            name: "seek",
            description: {
                content: "Seek to a specific time in the current track",
                usage: "<time>",
                examples: ["1m", "1h", "1h 1m", "1h 1m 1s"]
            },
            category: "music",
            cooldown: 3,
            args: true,
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
            slashCommand: true,
            options: [
                {
                    name: "time",
                    description: "The time to seek to",
                    type: 3,
                    required: true
                }
            ]
        });
    }
    async run(ctx, args) {
        const player = this.client.manager.getPlayer(ctx.guild.id);
        const embed = this.client.embed();
        const time = stringToTime(args[0]);
        if (!time) {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription("Please provide a valid time")] });
        } else {
            player.seek(time);
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription(`Seeked to \`${args[0]}\``)] });
        }
    }
}