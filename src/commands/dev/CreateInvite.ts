/** biome-ignore-all lint/style/noNonNullAssertion: explanation */
import { ChannelType, PermissionFlagsBits, type TextChannel } from "discord.js";
import { Command, type Context, type Lavamusic } from "../../structures/index";

export default class CreateInvite extends Command {
	constructor(client: Lavamusic) {
		super(client, {
			name: "createinvite",
			description: {
				content: "Create an invite link for a guild",
				examples: ["createinvite 0000000000000000000"],
				usage: "createinvite <guildId>",
			},
			category: "dev",
			aliases: ["ci", "gi", "ginvite", "guildinvite"],
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
				client: [
					"SendMessages",
					"CreateInstantInvite",
					"ReadMessageHistory",
					"EmbedLinks",
					"ViewChannel",
				],
				user: [],
			},
			slashCommand: false,
			options: [],
		});
	}

	public async run(
		client: Lavamusic,
		ctx: Context,
		args: string[],
	): Promise<any> {
		const guild = client.guilds.cache.get(args[0]);

		if (!guild) {
			return await ctx.sendMessage({
				embeds: [
					this.client
						.embed()
						.setColor(this.client.color.red)
						.setDescription("Guild not found"),
				],
			});
		}

		const textChannel = guild.channels.cache.find(
			(c) =>
				c.type === ChannelType.GuildText &&
				c
					.permissionsFor(guild.members.me!)
					?.has(
						PermissionFlagsBits.CreateInstantInvite |
							PermissionFlagsBits.SendMessages |
							PermissionFlagsBits.ViewChannel,
					),
		) as TextChannel | undefined;

		if (!textChannel) {
			return await ctx.sendMessage({
				embeds: [
					this.client
						.embed()
						.setColor(this.client.color.red)
						.setDescription("No suitable channel found"),
				],
			});
		}

		const invite = await textChannel.createInvite({
			maxAge: 3600,
			maxUses: 0,
			reason: `Requested by developer: ${ctx.author?.username}`,
		});

		return await ctx.sendMessage({
			embeds: [
				this.client
					.embed()
					.setColor(this.client.color.main)
					.setDescription(
						`Invite link for ${guild.name}: [Link](${invite.url})`,
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
 * https://discord.gg/YQsGbTwPBx
 */
