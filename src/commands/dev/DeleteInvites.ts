import { Command, type Context, type Lavamusic } from "../../structures/index";

export default class DestroyInvites extends Command {
	constructor(client: Lavamusic) {
		super(client, {
			name: "destroyinvites",
			description: {
				content: "Destroy all invite links created by the bot in a guild",
				examples: ["destroyinvites 0000000000000000000"],
				usage: "destroyinvites <guildId>",
			},
			category: "dev",
			aliases: ["di"],
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
					"ManageGuild",
					"ReadMessageHistory",
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
			return await ctx.sendMessage("Guild not found.");
		}

		try {
			const botInvites = (await guild.invites.fetch()).filter(
				(invite) => invite.inviter?.id === client.user?.id,
			);

			await Promise.all(botInvites.map((invite) => invite.delete()));

			return await ctx.sendMessage(
				`Destroyed ${botInvites.size} invite(s) created by the bot.`,
			);
		} catch {
			return await ctx.sendMessage("Failed to destroy invites.");
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
