import type { GuildMember } from "discord.js";
import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class _247 extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "247",
            description: {
                content: "Set the bot to stay in the voice channel",
                examples: ["247"],
                usage: "247",
            },
            category: "config",
            aliases: ["stay"],
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
                user: ["ManageGuild"],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const embed = this.client.embed();
        let player = client.shoukaku.players.get(ctx.guild.id) as any;
        try {
            const data = await client.db.get_247(ctx.guild.id);
            const member = ctx.member as GuildMember;
            if (!member.voice.channel) {
                return await ctx.sendMessage({
                    embeds: [
                        embed.setDescription("You need to be in a voice channel to use this command.").setColor(this.client.color.red),
                    ],
                });
            }
            if (data) {
                await client.db.delete_247(ctx.guild.id);
                return await ctx.sendMessage({
                    embeds: [embed.setDescription("**24/7 mode has been disabled**").setColor(this.client.color.red)],
                });
            }
            await client.db.set_247(ctx.guild.id, ctx.channel.id, member.voice.channel.id);
            if (!player) {
                player = await client.queue.create(
                    ctx.guild,
                    member.voice.channel,
                    ctx.channel,
                    client.shoukaku.options.nodeResolver(client.shoukaku.nodes),
                );
            }
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setDescription(
                            "**24/7 mode has been enabled. The bot will not leave the voice channel even if there are no people in the voice channel.**",
                        )
                        .setColor(this.client.color.main),
                ],
            });
        } catch (error) {
            console.error("Error in 247 command:", error);
            return await ctx.sendMessage({
                embeds: [embed.setDescription("An error occurred while trying to execute this command.").setColor(this.client.color.red)],
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
