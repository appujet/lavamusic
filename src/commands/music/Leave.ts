import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Leave extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "leave",
            description: {
                content: "Leaves the voice channel",
                examples: ["leave"],
                usage: "leave",
            },
            category: "music",
            aliases: ["l"],
            cooldown: 3,
            args: false,
            vote: false,
            player: {
                voice: true,
                dj: true,
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
        const player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();
        if (player) {
            await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.main)
                        .setDescription(`Left <#${player.node.manager.connections.get(ctx.guild.id)?.channelId}>`),
                ],
            });
            player.destroy();
        } else {
            await ctx.sendMessage({
                embeds: [embed.setColor(this.client.color.red).setDescription(`I'm not in a voice channel`)],
            });
        }
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
