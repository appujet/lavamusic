import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Skipto extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "skipto",
            description: {
                content: "Skips to a specific song in the queue",
                examples: ["skipto 3"],
                usage: "skipto <number>",
            },
            category: "music",
            aliases: ["skt"],
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
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "number",
                    description: "The number of the song you want to skip to",
                    type: 4,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();
        const number = Number(args[0]);

        if (!player.queue.length || isNaN(number) || number > player.queue.length || number < 1) {
            return await ctx.sendMessage({
                embeds: [embed.setColor(this.client.color.red).setDescription("Please provide a valid number.")],
            });
        }

        player.skip(number - 1);
        return await ctx.sendMessage({
            embeds: [embed.setColor(this.client.color.main).setDescription(`Skipped to song number ${number}.`)],
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
