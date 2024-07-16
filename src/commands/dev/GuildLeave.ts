import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class GuildLeave extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "guildleave",
            description: {
                content: "Leave a guild",
                examples: ["guildleave <guildId>"],
                usage: "guildleave <guildId>",
            },
            category: "dev",
            aliases: ["gl"],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: true,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: false,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const guildId = args[0];
        const guild = client.guilds.cache.get(guildId);
        if (!guild) return await ctx.sendMessage("Guild not found.");
        try {
            await guild.leave();
            await ctx.sendMessage(`Left guild ${guild.name}`);
        } catch {
            await ctx.sendMessage(`Failed to leave guild ${guild.name}`);
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
