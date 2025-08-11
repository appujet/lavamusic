import { spawn } from "node:child_process";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command, type Context, type Lavamusic } from "../../structures/index";

export default class Restart extends Command {
	constructor(client: Lavamusic) {
		super(client, {
			name: "restart",
			description: {
				content: "Restart the bot",
				examples: ["restart"],
				usage: "restart",
			},
			category: "dev",
			aliases: ["reboot"],
			cooldown: 3,
			args: false,
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
					"ReadMessageHistory",
					"ViewChannel",
					"EmbedLinks",
				],
				user: [],
			},
			slashCommand: false,
			options: [],
		});
	}

	public async run(client: Lavamusic, ctx: Context): Promise<void> {
		const embed = this.client.embed();
		const button = new ButtonBuilder()
			.setStyle(ButtonStyle.Danger)
			.setLabel("Confirm Restart")
			.setCustomId("confirm-restart");
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
		const restartEmbed = embed
			.setColor(this.client.color.red)
			.setDescription(
				`**Are you sure you want to restart **\`${client.user?.username}\`?`,
			)
			.setTimestamp();

		const msg = await ctx.sendMessage({
			embeds: [restartEmbed],
			components: [row],
		});

		const filter = (i: any) =>
			i.customId === "confirm-restart" && i.user.id === ctx.author?.id;
		const collector = msg.createMessageComponentCollector({
			time: 30000,
			filter,
		});

		collector.on("collect", async (i) => {
			await i.deferUpdate();

			await msg.edit({
				content: "Restarting the bot...",
				embeds: [],
				components: [],
			});

			try {
				// Destroy client connection
				await client.destroy();

				// Restart logic
				const child = spawn("npm", ["run", "start"], {
					detached: true,
					stdio: "ignore",
				});
				child.unref();
				process.exit(0);
			} catch (error) {
				console.error("[RESTART ERROR]:", error);
				await msg.edit({
					content: "An error occurred while restarting the bot.",
					components: [],
				});
			}
		});

		collector.on("end", async () => {
			if (collector.collected.size === 0) {
				await msg.edit({
					content: "Restart cancelled.",
					components: [],
				});
			}
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
