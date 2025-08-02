import { Command, type Context, type Lavamusic } from "../../structures/index";

export default class Leave extends Command {
	constructor(client: Lavamusic) {
		super(client, {
			name: "leave",
			description: {
				content: "cmd.leave.description",
				examples: ["leave"],
				usage: "leave",
			},
			category: "music",
			aliases: ["l"],
			cooldown: 3,
			args: false,
			vote: false,
			player: {
				voice: true,
				dj: true,
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
				],
				user: [],
			},
			slashCommand: true,
			options: [],
		});
	}

	public async run(client: Lavamusic, ctx: Context): Promise<any> {
		const player = client.manager.getPlayer(ctx.guild.id);
		const embed = this.client.embed();

		if (player) {
			const channelId = player.voiceChannelId;
			player.destroy();
			return await ctx.sendMessage({
				embeds: [
					embed
						.setColor(this.client.color.main)
						.setDescription(ctx.locale("cmd.leave.left", { channelId })),
				],
			});
		}
		return await ctx.sendMessage({
			embeds: [
				embed
					.setColor(this.client.color.red)
					.setDescription(ctx.locale("cmd.leave.not_in_channel")),
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
