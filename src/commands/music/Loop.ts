import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Loop extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "loop",
            description: {
                content: "Loop the current song or the queue",
                examples: ["loop", "loop queue", "loop song"],
                usage: "loop",
            },
            category: "general",
            aliases: ["loop"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: false,
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
        const embed = this.client.embed().setColor(this.client.color.main);
        const player = client.queue.get(ctx.guild.id);
        let loopMessage = "";

        switch (player.loop) {
            case "off":
                player.loop = "repeat";
                loopMessage = "**Looping the song.**";
                break;
            case "repeat":
                player.loop = "queue";
                loopMessage = "**Looping the queue.**";
                break;
            case "queue":
                player.loop = "off";
                loopMessage = "**Looping is now off.**";
                break;
        }

        return await ctx.sendMessage({
            embeds: [embed.setDescription(loopMessage)],
        });
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
