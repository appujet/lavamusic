import { Command, type Context, type Lavamusic } from "../../structures/index.js";
import { ChannelType } from "discord.js";

export default class CreateInvite extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "createinvite",
            description: {
                content: "Create a one-time use, unlimited duration invite link for a guild",
                examples: ["createinvite 0000000000000000000"],
                usage: "createinvite <guildId>",
            },
            category: "dev",
            aliases: ["ci"],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: true,
                client: ["SendMessages", "CreateInstantInvite", "ReadMessageHistory", "ViewChannel"],
                user: [],
            },
            slashCommand: false,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const guildId = args[0];

        const guild = client.guilds.cache.get(guildId);

        if (!guild) {
            return await ctx.sendMessage("Guild not found.");
        }

        try {
            const textChannel = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText);
            
            if (!textChannel) {
                return await ctx.sendMessage("No text channel found in the guild.");
            }

            const invite = await textChannel.createInvite({
                maxUses: 1,
                maxAge: 0
            });

            await ctx.author.send(`Guild: ${guild.name}\nInvite Link: ${invite.url}`);
            await ctx.sendMessage("Invite link has been sent to your DM.");
        } catch (error) {
            await ctx.sendMessage("Failed to create invite link.");
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
