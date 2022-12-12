import Command from "../../structures/Command.js"; 

export default class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: {
                content: 'To check the bot\'s latency.',
                usage: 'ping',
                examples: ['ping'],
            },
            category: 'general',
            cooldown: 3,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            slashCommand: true,
        });
    }
    async run(ctx, args) {

        const msg = await ctx.sendDeferMessage('Pinging...');

        const embed = this.client.embed()
            .setAuthor({ name: "Pong", iconURL: this.client.user.displayAvatarURL() })
            .setColor(this.client.color.default)
            .addFields([
                { name: "Bot Latency", value: `\`\`\`ini\n[ ${msg.createdTimestamp - ctx.createdTimestamp}ms ]\n\`\`\``, inline: true },
                { name: "API Latency", value: `\`\`\`ini\n[ ${Math.round(ctx.client.ws.ping)}ms ]\n\`\`\``, inline: true }
            ])
            .setFooter({ text: `Requested by ${ctx.author.tag}`, iconURL: ctx.author.avatarURL({ dynamic: true }) })
            .setTimestamp();
        return await ctx.editMessage({ content: '', embeds: [embed]})
    }
}
