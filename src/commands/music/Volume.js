import Command from "../../structures/Command.js";

export default class Volume extends Command {
    constructor(client) {
        super(client, {
            name: "volume",
            description: {
                content: "Change the volume of the player",
                usage: "volume <1-100>",
                examples: ["volume 50"],
            },
            aliases: ["vol"],
            category: "music",
            cooldown: 3,
            args: true,
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
            options: [
                {
                    name: "volume",
                    description: "The volume you want to set",
                    type: 4,
                    required: true,
                    
                }
            ]
        });
    }
    async run(ctx, args) {
        const player = this.client.manager.getPlayer(ctx.guild.id);
        const embed = this.client.embed();
        const volume = Number(args[0]);
        if (isNaN(volume)) {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription("Please provide a valid number")] });
        }
        if (volume < 1 || volume > 200) {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription("Please provide a number between 1 and 200")] });
        }
        player.player.setVolume(volume / 100)
        return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription(`Set the volume to \`${volume}\``)] });
    }
}