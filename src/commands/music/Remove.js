import Command from "../../structures/Command.js";

export default class Remove extends Command {
    constructor(client) {
        super(client, {
            name: "remove",
            description: {
                content: "Remove a song from the queue",
                usage: "<song number>",
                examples: ["1", "2", "3"]
            },
            aliases: ["rm"],
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
                    name: "song",
                    description: "The song number you want to remove",
                    type: 4,
                    required: true
                }
            ],
        });
    }
    async run(ctx, args) {
        const player = this.client.manager.getPlayer(ctx.guild.id);
        const embed = this.client.embed();
        const song = Number(args[0]);
        if (isNaN(song)) {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription("Please provide a valid number")] });
        }
        if (song < 1 || song > player.queue.length) {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.error).setDescription("Please provide a number between 1 and " + player.queue.length)] });
        }
        const removed = player.queue[song - 1];
        player.remove(song - 1);
        return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription(`Removed \`${removed.title}\``)] });
    }
}