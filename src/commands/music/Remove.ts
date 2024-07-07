import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Remove extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "remove",
            description: {
                content: "Removes a song from the queue",
                examples: ["remove 1"],
                usage: "remove <song number>",
            },
            category: "music",
            aliases: ["rm"],
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
                    name: "song",
                    description: "The song number",
                    type: 4,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();

        if (!player.queue.length)
            return await ctx.sendMessage({
                embeds: [embed.setColor(this.client.color.red).setDescription("There are no songs in the queue.")],
            });

        const songNumber = Number(args[0]);
        if (isNaN(songNumber) || songNumber <= 0 || songNumber > player.queue.length)
            return await ctx.sendMessage({
                embeds: [embed.setColor(this.client.color.red).setDescription("Please provide a valid song number.")],
            });
        player.remove(songNumber - 1);
        return await ctx.sendMessage({
            embeds: [embed.setColor(this.client.color.main).setDescription(`Removed song number ${songNumber} from the queue`)],
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
