import {
	ActionRowBuilder,
	ActivityType,
	ButtonBuilder,
	ButtonStyle,
	CommandInteraction,
	Message,
	MessageFlags,
	type TextChannel,
} from "discord.js";
import type { Context, Lavamusic } from "../structures/index";

export class Utils {
	public static formatTime(ms: number): string {
		const minuteMs = 60 * 1000;
		const hourMs = 60 * minuteMs;
		const dayMs = 24 * hourMs;
		if (ms < minuteMs) return `${ms / 1000}s`;
		if (ms < hourMs)
			return `${Math.floor(ms / minuteMs)}m ${Math.floor((ms % minuteMs) / 1000)}s`;
		if (ms < dayMs)
			return `${Math.floor(ms / hourMs)}h ${Math.floor((ms % hourMs) / minuteMs)}m`;
		return `${Math.floor(ms / dayMs)}d ${Math.floor((ms % dayMs) / hourMs)}h`;
	}

	public static updateStatus(client: Lavamusic, guildId?: string): void {
		const { user } = client;
		if (user && client.env.GUILD_ID && guildId === client.env.GUILD_ID) {
			const player = client.manager.getPlayer(client.env.GUILD_ID);
			user.setPresence({
				activities: [
					{
						name: player?.queue?.current
							? `🎶 | ${player.queue?.current.info.title}`
							: client.env.BOT_ACTIVITY,
						type: player?.queue?.current
							? ActivityType.Listening
							: client.env.BOT_ACTIVITY_TYPE,
					},
				],
				status: client.env.BOT_STATUS as any,
			});
		}
	}

	public static async setVoiceStatus(
		client: Lavamusic,
		channelId: string,
		message: string,
	): Promise<void> {
		await client.rest
			.put(`/channels/${channelId}/voice-status`, { body: { status: message } })
			.catch(() => {});
	}

	public static chunk(array: any[], size: number) {
		const chunked_arr: any[][] = [];
		for (let index = 0; index < array.length; index += size) {
			chunked_arr.push(array.slice(index, size + index));
		}
		return chunked_arr;
	}

	public static formatBytes(bytes: number, decimals = 2): string {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
	}

	public static formatNumber(number: number): string {
		return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	}

	public static parseTime(string: string): number {
		const time = string.match(/(\d+[dhms])/g);
		if (!time) return 0;
		let ms = 0;
		for (const t of time) {
			const unit = t[t.length - 1];
			const amount = Number(t.slice(0, -1));
			if (unit === "d") ms += amount * 24 * 60 * 60 * 1000;
			else if (unit === "h") ms += amount * 60 * 60 * 1000;
			else if (unit === "m") ms += amount * 60 * 1000;
			else if (unit === "s") ms += amount * 1000;
		}
		return ms;
	}

	public static progressBar(current: number, total: number, size = 20): string {
		const percent = Math.round((current / total) * 100);
		const filledSize = Math.round((size * current) / total);
		const filledBar = "▓".repeat(filledSize);
		const emptyBar = "░".repeat(size - filledSize);
		return `${filledBar}${emptyBar} ${percent}%`;
	}

	public static async paginate(
		client: Lavamusic,
		ctx: Context,
		embed: any[],
	): Promise<void> {
		if (embed.length < 2) {
			if (ctx.isInteraction) {
				ctx.deferred
					? await ctx.interaction?.followUp({ embeds: embed })
					: await ctx.interaction?.reply({ embeds: embed });
				return;
			}
			await (ctx.channel as TextChannel).send({ embeds: embed });
			return;
		}

		let page = 0;
		let stoppedManually = false;

		const getButton = (page: number): any => {
			const firstEmbed = page === 0;
			const lastEmbed = page === embed.length - 1;
			const pageEmbed = embed[page];
			const first = new ButtonBuilder()
				.setCustomId("first")
				.setEmoji(client.emoji.page.first)
				.setStyle(ButtonStyle.Primary)
				.setDisabled(firstEmbed);
			const back = new ButtonBuilder()
				.setCustomId("back")
				.setEmoji(client.emoji.page.back)
				.setStyle(ButtonStyle.Primary)
				.setDisabled(firstEmbed);
			const next = new ButtonBuilder()
				.setCustomId("next")
				.setEmoji(client.emoji.page.next)
				.setStyle(ButtonStyle.Primary)
				.setDisabled(lastEmbed);
			const last = new ButtonBuilder()
				.setCustomId("last")
				.setEmoji(client.emoji.page.last)
				.setStyle(ButtonStyle.Primary)
				.setDisabled(lastEmbed);
			const stop = new ButtonBuilder()
				.setCustomId("stop")
				.setEmoji(client.emoji.page.cancel)
				.setStyle(ButtonStyle.Danger);
			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
				first,
				back,
				stop,
				next,
				last,
			);
			return { embeds: [pageEmbed], components: [row] };
		};

		const msgOptions = getButton(0);
		let msg: Message;

		if (ctx.isInteraction) {
			if (ctx.deferred) {
				await ctx.interaction!.followUp(msgOptions);
				msg = (await ctx.interaction!.fetchReply()) as Message;
			} else {
				await ctx.interaction!.reply(msgOptions);
				msg = (await ctx.interaction!.fetchReply()) as Message;
			}
		} else {
			msg = await (ctx.channel as TextChannel).send(msgOptions);
		}

		const author = ctx instanceof CommandInteraction ? ctx.user : ctx.author;

		const filter = (int: any): any => int.user.id === author?.id;
		const collector = msg.createMessageComponentCollector({
			filter,
			time: 60000,
		});

		collector.on("collect", async (interaction) => {
			if (interaction.user.id !== author?.id) {
				await interaction.reply({
					content: ctx.locale("buttons.errors.not_author"),
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			await interaction.deferUpdate();

			switch (interaction.customId) {
				case "first":
					if (page !== 0) page = 0;
					break;
				case "back":
					if (page > 0) page--;
					break;
				case "next":
					if (page < embed.length - 1) page++;
					break;
				case "last":
					if (page !== embed.length - 1) page = embed.length - 1;
					break;
				case "stop":
					stoppedManually = true;
					collector.stop();
					try {
						await msg.edit({ components: [] });
					} catch {}
					return;
			}

			await interaction.editReply(getButton(page));
		});

		collector.on("end", async () => {
			if (stoppedManually) return;
			try {
				await msg.edit({ embeds: [embed[page]], components: [] });
			} catch {}
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
