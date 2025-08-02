import {
	Command,
	type Context,
	type Lavamusic,
} from "../../structures/index.js";

export default class Tremolo extends Command {
	constructor(client: Lavamusic) {
		super(client, {
			name: "tremolo",
			description: {
				content: "cmd.tremolo.description",
				examples: ["tremolo"],
				usage: "tremolo",
			},
			category: "filters",
			aliases: ["tr"],
			cooldown: 3,
			args: false,
			vote: false,
			player: {
				voice: true,
				dj: true,
				active: true,
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
		if (!player)
			return await ctx.sendMessage(
				ctx.locale("event.message.no_music_playing"),
			);
		const tremoloEnabled = player.filterManager.filters.tremolo;

		if (tremoloEnabled) {
			player.filterManager.toggleTremolo();
			await ctx.sendMessage({
				embeds: [
					{
						description: ctx.locale("cmd.tremolo.messages.disabled"),
						color: this.client.color.main,
					},
				],
			});
		} else {
			player.filterManager.toggleTremolo();
			await ctx.sendMessage({
				embeds: [
					{
						description: ctx.locale("cmd.tremolo.messages.enabled"),
						color: this.client.color.main,
					},
				],
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
 * https://discord.gg/YQsGbTwPBx
 */
