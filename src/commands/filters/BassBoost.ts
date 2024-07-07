import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class BassBoost extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "bassboost",
            description: {
                content: "on/off bassboost filter",
                examples: ["bassboost"],
                usage: "bassboost",
            },
            category: "filters",
            aliases: ["bb"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: true,
                active: true,
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
        const filterEnabled = player.filters.includes("bassboost");
        if (filterEnabled) {
            player.player.setEqualizer([]);
            player.filters = player.filters.filter((filter) => filter !== "bassboost");
            ctx.sendMessage({
                embeds: [
                    {
                        description: "Bassboost filter has been disabled.",
                        color: client.color.main,
                    },
                ],
            });
        } else {
            player.player.setEqualizer([
                { band: 0, gain: 0.34 },
                { band: 1, gain: 0.34 },
                { band: 2, gain: 0.34 },
                { band: 3, gain: 0.34 },
            ]);
            player.filters.push("bassboost");
            ctx.sendMessage({
                embeds: [
                    {
                        description: "Bassboost filter has been enabled. **Be careful, listening too loudly can damage your hearing!**",
                        color: client.color.main,
                    },
                ],
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
