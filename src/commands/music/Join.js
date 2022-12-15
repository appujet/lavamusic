import Command from "../../structures/Command.js";


export default class Join extends Command {
    constructor(client) {
        super(client, {
            name: "join",
            description: {
                content: "Join the voice channel",
                usage: "join",
                examples: ["join"]
            },
            aliases: ["j"],
            category: "music",
            cooldown: 3,
            args: false,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: []
            },
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null
            },
            slashCommand: true
        })
    }
    async run(ctx, args) {
        const embed = this.client.embed();
        let player = this.client.manager.getPlayer(ctx.guild.id);
        if (!player) {
            player = this.client.manager.create(ctx.guild, ctx.member, ctx.channel);
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription(`Joined \`${ctx.member.voice.channel.name}\``)] });
        } else {
            return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.default).setDescription(`I'm already connected to \`${ctx.member.voice.channel.name}\``)] });
        }
    }
}