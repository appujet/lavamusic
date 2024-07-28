import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Shuffle extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "shuffle",
            description: {
                content: "cmd.shuffle.description",
                examples: ["shuffle"],
                usage: "shuffle",
            },
            category: "music",
            aliases: ["sh"],
            cooldown: 3,
            args: false,
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
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild!.id);
        const embed = this.client.embed();
        if (!player.queue.length) {
            return await ctx.sendMessage({
                embeds: [embed.setColor(this.client.color.red).setDescription(ctx.locale("cmd.player.errors.no_songs"))],
            });
        }
        player.setShuffle();
        return await ctx.sendMessage({
            embeds: [embed.setColor(this.client.color.main).setDescription(ctx.locale("cmd.shuffle.messages.shuffled"))],
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
