import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Rate extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "rate",
            description: {
                content: "Change the rate of the song",
                examples: ["rate 1", "pitch 1.5", "pitch 1,5"],
                usage: "rate <number>",
            },
            category: "filters",
            aliases: ["rt"],
            cooldown: 3,
            args: true,
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
            options: [
                {
                    name: "rate",
                    description: "The number you want to set the rate to (between 0.5 and 5)",
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        const rateString = args[0].replace(",", ".");
        const isValidNumber = /^[0-9]*\.?[0-9]+$/.test(rateString);
        const rate = parseFloat(rateString);
        if (!isValidNumber || isNaN(rate) || rate < 0.5 || rate > 5) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: "Please provide a valid number between 0.5 and 5.",
                        color: this.client.color.red,
                    },
                ],
            });
        }
        player.player.setTimescale({ rate: rate });
        return await ctx.sendMessage({
            embeds: [
                {
                    description: `Pitch and speed has been set to ${rate}.`,
                    color: this.client.color.main,
                },
            ],
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
