import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Volume extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "volume",
            description: {
                content: "Sets the volume of the player",
                examples: ["volume 100"],
                usage: "volume <number>",
            },
            category: "filters",
            aliases: ["vol"],
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
                    name: "number",
                    description: "The volume you want to set",
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
        if (isNaN(number) || number < 0 || number > 200) {
            let description = "";
            if (isNaN(number)) description = "Please provide a valid number.";
            else if (number < 0) description = "The volume can't be lower than 0.";
            else if (number > 200)
                description =
                    "The volume can't be higher than 200. Do you want to damage your hearing or speakers? Hmmm, I don't think that's such a good idea.";
            return await ctx.sendMessage({
                embeds: [embed.setColor(this.client.color.red).setDescription(description)],
            });
        }

        // Set volume and read new value from player
        await player.player.setGlobalVolume(number);
        const currentVolume = player.player.volume;

        // Make sure the value is read and displayed correctly
        return await ctx.sendMessage({
            embeds: [embed.setColor(this.client.color.main).setDescription(`Set the volume to ${currentVolume}`)],
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
