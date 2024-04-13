import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class LavaLink extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'lavalink',
            description: {
                content: 'Shows the current Lavalink stats',
                examples: ['lavalink'],
                usage: 'lavalink',
            },
            category: 'info',
            aliases: ['ll'],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
        });
    }
    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const embed = this.client.embed();
        embed.setTitle('Lavalink Stats');
        embed.setColor(this.client.color.main);
        embed.setThumbnail(this.client.user.avatarURL({}));
        embed.setTimestamp();
        client.shoukaku.nodes.forEach(node => {
            if (!node.stats) {
                embed.addFields({
                    name: 'Name:',
                    value: `${node.name} (🔴)\n\`\`\`yaml\nPlayer: 0\nPlaying Players: 0\nUptime: 0\nCores: 0 Core(s)\nMemory Usage: 0/0\nSystem Load: 0%\nLavalink Load: 0%\`\`\``,
                });
                return;
            }
            try {
                embed.addFields({
                    name: 'Name:',
                    value: `${node.name} (${node.stats ? '🟢' : '🔴'})\n\`\`\`yaml\nPlayer: ${node.stats.players}\nPlaying Players: ${node.stats.playingPlayers}\nUptime: ${client.utils.formatTime(node.stats.uptime)}\nCores: ${node.stats.cpu.cores} Core(s)\nMemory Usage: ${client.utils.formatBytes(node.stats.memory.used)}/${client.utils.formatBytes(node.stats.memory.reservable)}\nSystem Load: ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%\nLavalink Load: ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%\`\`\``,
                });
            } catch (e) {
                console.log(e);
            }
        });
        return await ctx.sendMessage({ embeds: [embed] });
    }
}
