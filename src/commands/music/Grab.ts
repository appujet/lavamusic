import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Grab extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "grab",
            description: {
                content: "Grabs the current playing song on your DM",
                examples: ["grab"],
                usage: "grab",
            },
            category: "music",
            aliases: [],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
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
        const song = player.current;
        try {
            const dm = this.client
                .embed()
                .setTitle(`**${song.info.title}**`)
                .setURL(song.info.uri)
                .setThumbnail(song.info.artworkUrl)
                .setDescription(
                    `**Duration:** ${song.info.isStream ? "LIVE" : client.utils.formatTime(song.info.length)}\n` +
                        `**Requested by:** ${song.info.requester}\n` +
                        `**Link:** [Click here](${song.info.uri})`,
                )
                .setColor(this.client.color.main);
            await ctx.author.send({ embeds: [dm] });
            return await ctx.sendMessage({
                embeds: [embed.setDescription("Please check your DM.").setColor(this.client.color.green)],
            });
        } catch (_e) {
            return await ctx.sendMessage({
                embeds: [embed.setDescription(`I couldn't send you a DM.`).setColor(this.client.color.red)],
            });
        }
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
