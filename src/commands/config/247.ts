import type { GuildMember } from "discord.js";
import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class _247 extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "247",
            description: {
                content: "cmd.247.description",
                examples: ["247"],
                usage: "247",
            },
            category: "config",
            aliases: ["stay"],
            cooldown: 3,
            args: false,
            vote: true,
            player: {
                voice: true,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: ["ManageGuild"],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const embed = this.client.embed();
        let player = client.shoukaku.players.get(ctx.guild!.id) as any;
        try {
            const data = await client.db.get_247(ctx.guild!.id);
            const member = ctx.member as GuildMember;
            if (!member.voice.channel) {
                return await ctx.sendMessage({
                    embeds: [embed.setDescription(ctx.locale("cmd.247.errors.not_in_voice")).setColor(client.color.red)],
                });
            }
            if (data) {
                await client.db.delete_247(ctx.guild!.id);
                return await ctx.sendMessage({
                    embeds: [embed.setDescription(ctx.locale("cmd.247.messages.disabled")).setColor(client.color.red)],
                });
            }
            await client.db.set_247(ctx.guild!.id, ctx.channel.id, member.voice.channel.id);
            if (!player) {
                player = await client.queue.create(
                    ctx.guild,
                    member.voice.channel,
                    ctx.channel,
                    client.shoukaku.options.nodeResolver(client.shoukaku.nodes),
                );
            }
            return await ctx.sendMessage({
                embeds: [embed.setDescription(ctx.locale("cmd.247.messages.enabled")).setColor(this.client.color.main)],
            });
        } catch (error) {
            console.error("Error in 247 command:", error);
            return await ctx.sendMessage({
                embeds: [embed.setDescription(ctx.locale("cmd.247.errors.generic")).setColor(client.color.red)],
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
