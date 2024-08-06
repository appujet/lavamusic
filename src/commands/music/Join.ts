import {
    Command,
    type Context,
    type Lavamusic,
} from "../../structures/index.js";

export default class Join extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "join",
            description: {
                content: "cmd.join.description",
                examples: ["join"],
                usage: "join",
            },
            category: "music",
            aliases: ["come", "j"],
            cooldown: 3,
            args: false,
            vote: false,
            player: {
                voice: true,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: [
                    "SendMessages",
                    "ReadMessageHistory",
                    "ViewChannel",
                    "EmbedLinks",
                    "Connect",
                    "Speak",
                ],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const embed = this.client.embed();
        let player = client.queue.get(ctx.guild!.id);

        if (player) {
            const channelId = player.node.manager.connections.get(
                ctx.guild!.id,
            )!.channelId;
            return await ctx.sendMessage({
                embeds: [
                    embed.setColor(this.client.color.main).setDescription(
                        ctx.locale("cmd.join.already_connected", {
                            channelId,
                        }),
                    ),
                ],
            });
        }

        const memberVoiceChannel = (ctx.member as any).voice.channel;
        if (!memberVoiceChannel) {
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.red)
                        .setDescription(
                            ctx.locale("cmd.join.no_voice_channel"),
                        ),
                ],
            });
        }

        player = await client.queue.create(
            ctx.guild!,
            memberVoiceChannel,
            ctx.channel,
            client.shoukaku.options.nodeResolver(client.shoukaku.nodes),
        );

        const joinedChannelId = player.node.manager.connections.get(
            ctx.guild!.id,
        )!.channelId;
        return await ctx.sendMessage({
            embeds: [
                embed.setColor(this.client.color.main).setDescription(
                    ctx.locale("cmd.join.joined", {
                        channelId: joinedChannelId,
                    }),
                ),
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
