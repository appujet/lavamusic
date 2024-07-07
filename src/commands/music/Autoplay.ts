import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Autoplay extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "autoplay",
            description: {
                content: "Toggles autoplay",
                examples: ["autoplay"],
                usage: "autoplay",
            },
            category: "music",
            aliases: ["ap"],
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
        const embed = this.client.embed();
        const autoplay = player.autoplay;
        player.setAutoplay(!autoplay);
        if (autoplay) {
            embed.setDescription("Autoplay has been disabled").setColor(this.client.color.main);
        } else {
            embed.setDescription("Autoplay has been enabled").setColor(this.client.color.main);
        }
        await ctx.sendMessage({ embeds: [embed] });
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
