import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Join extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "join",
            description: {
                content: "Joins the voice channel",
                examples: ["join"],
                usage: "join",
            },
            category: "music",
            aliases: ["come", "j"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: false,
                active: false,
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
        let player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();
        const voiceChannel = (ctx.member as any).voice.channel;

        if (player) {
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.main)
                        .setDescription(`I'm already connected to <#${player.node.manager.connections.get(ctx.guild.id)?.channelId}>`),
                ],
            });
        }

        player = await client.queue.create(
            ctx.guild,
            voiceChannel,
            ctx.channel,
            client.shoukaku.options.nodeResolver(client.shoukaku.nodes),
        );

        return await ctx.sendMessage({
            embeds: [
                embed
                    .setColor(this.client.color.main)
                    .setDescription(`Joined <#${player.node.manager.connections.get(ctx.guild.id)?.channelId}>`),
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
