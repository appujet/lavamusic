import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Speed extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "speed",
            description: {
                content: "Sets the speed of the song",
                examples: ["speed 1.5", "speed 1,5"],
                usage: "speed <number>",
            },
            category: "filters",
            aliases: ["spd"],
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
                    name: "speed",
                    description: "The speed you want to set",
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        const speedString = args[0].replace(",", ".");
        const isValidNumber = /^[0-9]*\.?[0-9]+$/.test(speedString);
        const speed = parseFloat(speedString);
        if (!isValidNumber || isNaN(speed) || speed < 0.5 || speed > 5) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: "Please provide a valid number between 0.5 and 5.",
                        color: this.client.color.red,
                    },
                ],
            });
        }
        player.player.setTimescale({speed});
        return await ctx.sendMessage({
            embeds: [
                {
                    description: `Speed has been set to ${speed}.`,
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
