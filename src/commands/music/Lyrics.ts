import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
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
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.manager.getPlayer(ctx.guild!.id);
        const embed = this.client.embed();

        const currentTrack = player.queue.current;
        const trackTitle = currentTrack.info.title.replace(/\[.*?\]/g, "").trim();
        const artistName = currentTrack.info.author.replace(/\[.*?\]/g, "").trim();
        const trackUrl = currentTrack.info.uri;
        const artworkUrl = currentTrack.info.artworkUrl;

        await ctx.sendDeferMessage(ctx.locale("cmd.lyrics.searching", { trackTitle }));

        const options = {
            apiKey: client.env.GENIUS_API,
            title: trackTitle,
            artist: artistName,
            optimizeQuery: true,
        };

        try {
            const lyrics = await getLyrics(options);
            if (lyrics) {
                const lyricsPages = this.paginateLyrics(lyrics);
                let currentPage = 0;

                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId("prev")
                        .setEmoji(this.client.emoji.page.back)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                    new ButtonBuilder().setCustomId("stop").setEmoji(this.client.emoji.page.cancel).setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId("next")
                        .setEmoji(this.client.emoji.page.next)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(lyricsPages.length <= 1),
                );

                await ctx.editMessage({
                    embeds: [
                        embed
                            .setColor(client.color.main)
                            .setDescription(
                                ctx.locale("cmd.lyrics.lyrics_track", { trackTitle, trackUrl, lyrics: lyricsPages[currentPage] }),
                            )
                            .setThumbnail(artworkUrl)
                            .setTimestamp(),
                    ],
                    components: [row],
                });

                const filter = (interaction) => interaction.user.id === ctx.author.id;
                const collector = ctx.channel.createMessageComponentCollector({
                    filter,
                    componentType: ComponentType.Button,
                    time: 60000,
                });

                collector.on("collect", async (interaction) => {
                    if (interaction.customId === "prev") {
                        currentPage--;
                    } else if (interaction.customId === "next") {
                        currentPage++;
                    } else if (interaction.customId === "stop") {
                        collector.stop();
                        return interaction.update({ components: [] });
                    }

                    await interaction.update({
                        embeds: [
                            embed
                                .setDescription(
                                    ctx.locale("cmd.lyrics.lyrics_track", { trackTitle, trackUrl, lyrics: lyricsPages[currentPage] }),
                                )
                                .setThumbnail(artworkUrl)
                                .setTimestamp(),
                        ],
                        components: [
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("prev")
                                    .setEmoji(this.client.emoji.page.back)
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(currentPage === 0),
                                new ButtonBuilder()
                                    .setCustomId("stop")
                                    .setEmoji(this.client.emoji.page.cancel)
                                    .setStyle(ButtonStyle.Danger),
                                new ButtonBuilder()
                                    .setCustomId("next")
                                    .setEmoji(this.client.emoji.page.next)
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(currentPage === lyricsPages.length - 1),
                            ),
                        ],
                    });
                });

                collector.on("end", () => {
                    ctx.editMessage({ components: [] });
                });
            } else {
                await ctx.editMessage({
                    embeds: [embed.setColor(client.color.red).setDescription(ctx.locale("cmd.lyrics.errors.no_results"))],
                });
            }
        } catch (error) {
            console.error(error);
            await ctx.editMessage({
                embeds: [embed.setColor(client.color.red).setDescription(ctx.locale("cmd.lyrics.errors.lyrics_error"))],
            });
        }
    }

    paginateLyrics(lyrics) {
        const lines = lyrics.split("\n");
        const pages = [];
        let page = "";

        for (const line of lines) {
            if (page.length + line.length > 2048) {
                pages.push(page);
                page = "";
            }
            page += `${line}\n`;
        }

        if (page) pages.push(page);
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
 * https://discord.gg/ns8CTk9J3e
 */
