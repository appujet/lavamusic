import { Command } from "../../structures/index.js";
export default class lowPass extends Command {
    constructor(client) {
        super(client, {
            name: "lowpass",
            description: {
                content: "on/off lowpass filter",
                examples: ["lowpass"],
                usage: "lowpass <number>"
            },
            category: "filters",
            aliases: ["lp"],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: true,
                active: false,
                djPerm: null
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: ['ManageGuild']
            },
            slashCommand: false,
        });
    }
    async run(client, ctx, args) {
        const player = client.queue.get(ctx.guild.id);
        if (player.filters.includes("lowpass")) {
            player.player.setLowPass({});
            player.filters.splice(player.filters.indexOf("lowpass"), 1);
            ctx.sendMessage({
                embeds: [
                    {
                        description: "Lowpass filter has been disabled",
                        color: client.color.main
                    }
                ]
            });
        }
        else {
            player.player.setLowPass({ smoothing: 20 });
            player.filters.push("lowpass");
            ctx.sendMessage({
                embeds: [
                    {
                        description: "Lowpass filter has been enabled",
                        color: client.color.main
                    }
                ]
            });
        }
    }
}
//# sourceMappingURL=lowPass.js.map