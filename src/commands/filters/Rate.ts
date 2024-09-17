import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Rate extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "rate",
            description: {
                content: "cmd.rate.description",
                examples: ["rate 1", "rate 1.5", "rate 1,5"],
                usage: "rate <number>",
            },
            category: "filters",
            aliases: ["rt"],
            cooldown: 3,
            args: true,
            vote: false,
            player: {
                voice: true,
                dj: true,
                active: true,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "rate",
                    description: "cmd.rate.options.rate",
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const player = client.manager.getPlayer(ctx.guild!.id);
        const rateString = args[0].replace(",", ".");
        const isValidNumber = /^[0-9]*\.?[0-9]+$/.test(rateString);
        const rate = parseFloat(rateString);

        if (!isValidNumber || isNaN(rate) || rate < 0.5 || rate > 5) {
            await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.rate.errors.invalid_number"),
                        color: this.client.color.red,
                    },
                ],
            });
            return;
        }

        await player.filterManager.setRate(rate);
        await ctx.sendMessage({
            embeds: [
                {
                    description: ctx.locale("cmd.rate.messages.rate_set", {
                        rate,
                    }),
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
