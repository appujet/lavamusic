import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Replay extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "replay",
            description: {
                content: "Replays the current track",
                examples: ["replay"],
                usage: "replay",
            },
            category: "music",
            aliases: ["rp"],
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
                client: ["SendMessages", "ViewChannel"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();

        if (!player.current) {
            return await ctx.sendMessage({
                embeds: [embed.setColor(this.client.color.red).setDescription("There is no track currently playing")],
            });
        }

        player.seek(0);

        return await ctx.sendMessage({
            embeds: [embed.setColor(this.client.color.main).setDescription("Replaying the current track")],
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
