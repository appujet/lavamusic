import { Command } from "../../structures/index.js";
export default class _247 extends Command {
    constructor(client) {
        super(client, {
            name: "247",
            description: {
                content: "set the bot to stay in the vc",
                examples: ["247"],
                usage: "247"
            },
            category: "config",
            aliases: ["stay"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: false,
                active: false,
                djPerm: null
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: ['ManageGuild']
            },
            slashCommand: true,
            options: []
        });
    }
    ;
    async run(client, ctx, args) {
        const embed = client.embed();
        let player = client.shoukaku.players.get(ctx.guild.id);
        const data = await client.prisma.stay.findFirst({
            where: {
                guildId: ctx.guild.id
            }
        });
        const vc = ctx.member;
        if (!data) {
            await client.prisma.stay.create({
                data: {
                    guildId: ctx.guild.id,
                    textId: ctx.channel.id,
                    voiceId: vc.voice.channelId
                }
            });
            if (!player)
                player = await client.queue.create(ctx.guild, vc.voice.channel, ctx.channel, client.shoukaku.getNode());
            return ctx.sendMessage({ embeds: [embed.setDescription(`**247 mode has been enabled**`).setColor(client.color.main)] });
        }
        else {
            await client.prisma.stay.delete({
                where: {
                    guildId: ctx.guild.id
                }
            });
            return ctx.sendMessage({ embeds: [embed.setDescription(`**247 mode has been disabled**`).setColor(client.color.red)] });
        }
    }
}
//# sourceMappingURL=247.js.map