import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class LavaLink extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "lavalink",
            description: {
                content: "cmd.lavalink.description",
                examples: ["lavalink"],
                usage: "lavalink",
            },
            category: "info",
            aliases: ["ll"],
            cooldown: 3,
            args: false,
            vote: false,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const embed = this.client
            .embed()
            .setTitle(ctx.locale("cmd.lavalink.title"))
            .setColor(this.client.color.main)
            .setThumbnail(this.client.user.avatarURL())
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
            ${ctx.locale("cmd.lavalink.content", {
                players: stats.players,
                playingPlayers: stats.playingPlayers,
                uptime: client.utils.formatTime(stats.uptime),
                cores: stats.cpu.cores,
                used: client.utils.formatBytes(stats.memory.used),
                reservable: client.utils.formatBytes(stats.memory.reservable),
                systemLoad: (stats.cpu.systemLoad * 100).toFixed(2),
                lavalinkLoad: (stats.cpu.lavalinkLoad * 100).toFixed(2),
            })}
            \`\`\``;

            embed.addFields({
                name: `${node.name} (${statusEmoji})`,
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
