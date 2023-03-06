import { Command, Lavamusic, Context } from "../../structures/index.js";


export default class Resume extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "resume",
            description: {
                content: "Resumes the current song",
                examples: ["resume"],
                usage: "resume"
            },
            category: "music",
            aliases: ["r"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: false,
                active: true,
                djPerm: null
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: []
            },
            slashCommand: true,
            options: []
        });
    };
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {

        const player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();
        if (!player.paused) return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.red).setDescription("The player is not paused.")] });
        player.pause();

        return ctx.sendMessage({ embeds: [embed.setColor(this.client.color.main).setDescription(`Resumed the player`)] });
    }
}

/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */