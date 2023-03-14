import { Command } from "../../structures/index.js";
export default class Grab extends Command {
    constructor(client) {
        super(client, {
            name: "grab",
            description: {
                content: "Grabs the current playing song",
                examples: ["grab"],
                usage: "grab"
            },
            category: "music",
            aliases: [],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
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
    }
    ;
    async run(client, ctx, args) {
        const embed = client.embed().setColor(client.color.main);
        let player = client.queue.get(ctx.guild.id);
        let song = player.current;
        try {
            const dm = client.embed()
                .setTitle(`**${song.info.title}**`)
                .setURL(song.info.uri)
                .setThumbnail(song.info.thumbnail)
                .setDescription(`**Duration:** ${song.info.isStream ? "LIVE" : client.utils.formatTime(song.info.length)}\n**Requested by:** ${song.info.requester}\n**Link:** [Click here](${song.info.uri})`)
                .setColor(client.color.main);
            await ctx.author.send({ embeds: [dm] });
        }
        catch (e) {
            return ctx.sendMessage({ embeds: [embed.setDescription(`**I couldn't send you a DM.**`).setColor(client.color.red)] });
        }
    }
}
//# sourceMappingURL=Grab.js.map