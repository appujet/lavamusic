import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Rotation extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "rotation",
            description: {
                content: "on/off rotation filter",
                examples: ["rotation"],
                usage: "rotation",
            },
            category: "filters",
            aliases: ["rt"],
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

    // biome-ignore lint/suspicious/useAwait: <explanation>
    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        if (player.filters.includes("rotation")) {
            player.player.setRotation();
            player.filters.splice(player.filters.indexOf("rotation"), 1);
            ctx.sendMessage({
                embeds: [
                    {
                        description: "Rotation filter has been disabled.",
                        color: client.color.main,
                    },
                ],
            });
        } else {
            player.player.setRotation({ rotationHz: 0 });
            player.filters.push("rotation");
            ctx.sendMessage({
                embeds: [
                    {
                        description: "Rotation filter has been enabled.",
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
