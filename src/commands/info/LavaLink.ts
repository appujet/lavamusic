import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class LavaLink extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "lavalink",
            description: {
                content: "Shows the current Lavalink stats",
                examples: ["lavalink"],
                usage: "lavalink",
            },
            category: "info",
            aliases: ["ll"],
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
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const embed = this.client
            .embed()
            .setTitle("Lavalink Stats")
            .setColor(this.client.color.main)
            .setThumbnail(this.client.user.avatarURL({}))
            .setTimestamp();
        client.shoukaku.nodes.forEach((node) => {
            const statusEmoji = node.stats ? "🟢" : "🔴";
            const stats = node.stats || {
                players: 0,
                playingPlayers: 0,
                uptime: 0,
                cpu: { cores: 0, systemLoad: 0, lavalinkLoad: 0 },
                memory: { used: 0, reservable: 0 },
            };
            const formattedStats = `\`\`\`yaml
Player: ${stats.players}
Playing Players: ${stats.playingPlayers}
Uptime: ${client.utils.formatTime(stats.uptime)}
Cores: ${stats.cpu.cores} Core(s)
Memory Usage: ${client.utils.formatBytes(stats.memory.used)} / ${client.utils.formatBytes(stats.memory.reservable)}
System Load: ${(stats.cpu.systemLoad * 100).toFixed(2)}%
Lavalink Load: ${(stats.cpu.lavalinkLoad * 100).toFixed(2)}%
\`\`\``;
            embed.addFields({
                name: `Name: ${node.name} (${statusEmoji})`,
                value: formattedStats,
            });
        });
        return await ctx.sendMessage({ embeds: [embed] });
    }
}

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
