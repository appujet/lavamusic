import {
	ActionRowBuilder,
	ButtonBuilder,
	type ButtonInteraction,
	ButtonStyle,
	ComponentType,
	type TextChannel,
	ContainerBuilder,
	SectionBuilder,
	MessageFlags,
} from "discord.js";
import { getLyrics } from "genius-lyrics-api";
import { Command, type Context, type Lavamusic } from "../../structures/index";

export default class Lyrics extends Command {
	constructor(client: Lavamusic) {
		super(client, {
			name: "lyrics",
			description: {
				content: "cmd.lyrics.description",
				examples: ["lyrics"],
				usage: "lyrics",
			},
			category: "music",
			aliases: ["ly"],
			cooldown: 3,
			args: false,
			vote: false,
			player: {
				voice: true,
				dj: false,
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
					"AttachFiles",
				],
				user: [],
			},
			slashCommand: true,
			options: [],
		});
	}

	private cleanLyrics(lyrics: string): string {
		let cleaned = lyrics;

		cleaned = cleaned.replace(
			/^(\d+\s*Contributors.*?Lyrics|.*Contributors.*|Lyrics\s*|.*Lyrics\s*)$/gim,
			"",
		);

		cleaned = cleaned.replace(/^[\s\n\r]+/, "");

		cleaned = cleaned.replace(/[\s\n\r]+$/, "");

		cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

		return cleaned.trim();
	}

	public async run(client: Lavamusic, ctx: Context): Promise<any> {
		const player = client.manager.getPlayer(ctx.guild.id);
		if (!player || !player.queue.current) {
			const noMusicContainer = new ContainerBuilder()
				.setAccentColor(this.client.color.red)
				.addTextDisplayComponents((textDisplay) =>
					textDisplay.setContent(ctx.locale("event.message.no_music_playing")),
				);
			return await ctx.sendMessage({
				components: [noMusicContainer],
				flags: MessageFlags.IsComponentsV2,
			});
		}

		const track = player.queue.current!;
		const trackTitle =
			track.info.title?.replace(/\[.*?\]|\(.*?\)|\{.*?\}/g, "").trim() ||
			"Unknown Title";
		const artistName =
			track.info.author?.replace(/\[.*?\]|\(.*?\)|\{.*?\}/g, "").trim() ||
			"Unknown Artist";
		const trackUrl = track.info.uri || "about:blank";
		const artworkUrl = track.info.artworkUrl;

		const searchingContainer = new ContainerBuilder()
			.setAccentColor(this.client.color.main)
			.addTextDisplayComponents((textDisplay) =>
				textDisplay.setContent(
					ctx.locale("cmd.lyrics.searching", { trackTitle }),
				),
			);

		await ctx.sendDeferMessage({
			components: [searchingContainer],
			flags: MessageFlags.IsComponentsV2,
		});

		const options = {
			apiKey: client.env.GENIUS_API,
			title: trackTitle,
			artist: artistName,
			optimizeQuery: true,
		};

		try {
			const rawLyrics = await getLyrics(options);
			if (rawLyrics) {
				const cleanedLyrics = this.cleanLyrics(rawLyrics);

				if (!cleanedLyrics || cleanedLyrics.length < 10) {
					const noResultsContainer = new ContainerBuilder()
						.setAccentColor(client.color.red)
						.addTextDisplayComponents((textDisplay) =>
							textDisplay.setContent(
								ctx.locale("cmd.lyrics.errors.no_results"),
							),
						);
					await ctx.editMessage({
						components: [noResultsContainer],
						flags: MessageFlags.IsComponentsV2,
					});
					return;
				}

				const lyricsPages = this.paginateLyrics(cleanedLyrics, ctx);
				let currentPage = 0;

				const createLyricsContainer = (
					pageIndex: number,
					finalState: boolean = false,
				) => {
					const currentLyricsPage =
						lyricsPages[pageIndex] ||
						ctx.locale("cmd.lyrics.no_lyrics_on_page");

					let fullContent =
						ctx.locale("cmd.lyrics.lyrics_for_track", {
							trackTitle: trackTitle,
							trackUrl: trackUrl,
						}) +
						"\n" +
						`*${artistName}*\n\n` +
						`${currentLyricsPage}`;

					if (!finalState) {
						fullContent += `\n\n${ctx.locale("cmd.lyrics.page_indicator", { current: pageIndex + 1, total: lyricsPages.length })}`;
					} else {
						fullContent += `\n\n*${ctx.locale("cmd.lyrics.session_expired")}*`;
					}

					const mainLyricsSection =
						new SectionBuilder().addTextDisplayComponents((textDisplay) =>
							textDisplay.setContent(fullContent),
						);

					if (artworkUrl && artworkUrl.length > 0) {
						mainLyricsSection.setThumbnailAccessory((thumbnail) =>
							thumbnail
								.setURL(artworkUrl)
								.setDescription(
									ctx.locale("cmd.lyrics.artwork_description", { trackTitle }),
								),
						);
					}

					const lyricsContainer = new ContainerBuilder()
						.setAccentColor(client.color.main)
						.addSectionComponents(mainLyricsSection);

					return lyricsContainer;
				};

				const getNavigationRow = (current: number) => {
					return new ActionRowBuilder<ButtonBuilder>().addComponents(
						new ButtonBuilder()
							.setCustomId("prev")
							.setEmoji(this.client.emoji.page.back)
							.setStyle(ButtonStyle.Secondary)
							.setDisabled(current === 0),
						new ButtonBuilder()
							.setCustomId("stop")
							.setEmoji(this.client.emoji.page.cancel)
							.setStyle(ButtonStyle.Danger),
						new ButtonBuilder()
							.setCustomId("next")
							.setEmoji(this.client.emoji.page.next)
							.setStyle(ButtonStyle.Secondary)
							.setDisabled(current === lyricsPages.length - 1),
					);
				};

				await ctx.editMessage({
					components: [
						createLyricsContainer(currentPage),
						getNavigationRow(currentPage),
					],
					flags: MessageFlags.IsComponentsV2,
				});

				const filter = (interaction: ButtonInteraction<"cached">) =>
					interaction.user.id === ctx.author?.id;
				const collector = (
					ctx.channel as TextChannel
				).createMessageComponentCollector({
					filter,
					componentType: ComponentType.Button,
					time: 60000,
				});

				collector.on("collect", async (interaction: ButtonInteraction) => {
					if (interaction.customId === "prev") {
						currentPage--;
					} else if (interaction.customId === "next") {
						currentPage++;
					} else if (interaction.customId === "stop") {
						collector.stop();
						return;
					}

					await interaction.update({
						components: [
							createLyricsContainer(currentPage),
							getNavigationRow(currentPage),
						],
					});
				});

				collector.on("end", async (_collected, _reason) => {
					if (
						ctx.guild?.members.me
							?.permissionsIn(ctx.channelId)
							.has("SendMessages")
					) {
						const finalContainer = createLyricsContainer(currentPage, true);
						await ctx
							.editMessage({
								components: [finalContainer],
								flags: MessageFlags.IsComponentsV2,
							})
							.catch((e) =>
								client.logger.error("Failed to clear lyrics buttons:", e),
							);
					}
				});
			} else {
				const noResultsContainer = new ContainerBuilder()
					.setAccentColor(client.color.red)
					.addTextDisplayComponents((textDisplay) =>
						textDisplay.setContent(ctx.locale("cmd.lyrics.errors.no_results")),
					);
				await ctx.editMessage({
					components: [noResultsContainer],
					flags: MessageFlags.IsComponentsV2,
				});
			}
		} catch (error) {
			client.logger.error(error);
			const errorContainer = new ContainerBuilder()
				.setAccentColor(client.color.red)
				.addTextDisplayComponents((textDisplay) =>
					textDisplay.setContent(ctx.locale("cmd.lyrics.errors.lyrics_error")),
				);
			await ctx.editMessage({
				components: [errorContainer],
				flags: MessageFlags.IsComponentsV2,
			});
		}
	}

	paginateLyrics(lyrics: string, ctx: Context): string[] {
		const lines = lyrics.split("\n");
		const pages: string[] = [];
		let currentPage = "";
		const MAX_CHARACTERS_PER_PAGE = 2800;

		for (const line of lines) {
			const lineWithNewline = `${line}\n`;

			if (
				currentPage.length + lineWithNewline.length >
				MAX_CHARACTERS_PER_PAGE
			) {
				if (currentPage.trim()) {
					pages.push(currentPage.trim());
				}
				currentPage = lineWithNewline;
			} else {
				currentPage += lineWithNewline;
			}
		}

		if (currentPage.trim()) {
			pages.push(currentPage.trim());
		}

		if (pages.length === 0) {
			pages.push(ctx.locale("cmd.lyrics.no_lyrics_available"));
		}

		return pages;
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
