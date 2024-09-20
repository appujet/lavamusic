import { ActionRowBuilder, ActivityType, ButtonBuilder, ButtonStyle, CommandInteraction, type TextChannel } from "discord.js";
import type { Context, Lavamusic } from "../structures/index";

export class Utils {
    public static formatTime(ms: number): string {
        const minuteMs = 60 * 1000;
        const hourMs = 60 * minuteMs;
        const dayMs = 24 * hourMs;
        if (ms < minuteMs) return `${ms / 1000}s`;
        if (ms < hourMs) return `${Math.floor(ms / minuteMs)}m ${Math.floor((ms % minuteMs) / 1000)}s`;
        if (ms < dayMs) return `${Math.floor(ms / hourMs)}h ${Math.floor((ms % hourMs) / minuteMs)}m`;
        return `${Math.floor(ms / dayMs)}d ${Math.floor((ms % dayMs) / hourMs)}h`;
    }

    public static updateStatus(client: Lavamusic, guildId?: string): void {
        const { user } = client;
        if (user && guildId === client.env.GUILD_ID) {
            const player = client.manager.getPlayer(client.env.GUILD_ID);
            user.setPresence({
                activities: [
                    {
                        name: player?.queue?.current ? `🎶 | ${player.queue?.current.info.title}` : client.env.BOT_ACTIVITY,
                        type: player?.queue?.current ? ActivityType.Listening : client.env.BOT_ACTIVITY_TYPE,
                    },
                ],
                status: client.env.BOT_STATUS as any,
            });
        }
    }

    public static chunk(array: any[], size: number) {
        const chunked_arr = [];
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
        return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
    }

    public static formatNumber(number: number): string {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }

    public static parseTime(string: string): number {
        const time = string.match(/([0-9]+[d,h,m,s])/g);
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

    public static async paginate(client: Lavamusic, ctx: Context, embed: any[]): Promise<void> {
        if (embed.length < 2) {
            if (ctx.isInteraction) {
                ctx.deferred ? ctx.interaction.followUp({ embeds: embed }) : ctx.interaction.reply({ embeds: embed });
                return;
            }

            (ctx.channel as TextChannel).send({ embeds: embed });
            return;
        }

        let page = 0;
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
            const stop = new ButtonBuilder().setCustomId("stop").setEmoji(client.emoji.page.cancel).setStyle(ButtonStyle.Danger);
            const row = new ActionRowBuilder().addComponents(first, back, stop, next, last);
            return { embeds: [pageEmbed], components: [row] };
        };

        const msgOptions = getButton(0);
        const msg = ctx.isInteraction
            ? await (ctx.deferred
                  ? ctx.interaction!.followUp({
                        ...msgOptions,
                        fetchReply: true as boolean,
                    })
                  : ctx.interaction!.reply({ ...msgOptions, fetchReply: true }))
            : await (ctx.channel as TextChannel).send({
                  ...msgOptions,
                  fetchReply: true,
              });

        const author = ctx instanceof CommandInteraction ? ctx.user : ctx.author;

        const filter = (int: any): any => int.user.id === author.id;
        const collector = msg.createMessageComponentCollector({
            filter,
            time: 60000,
        });

        collector.on("collect", async (interaction) => {
            if (interaction.user.id === author.id) {
                await interaction.deferUpdate();
                if (interaction.customId === "first" && page !== 0) {
                    page = 0;
                } else if (interaction.customId === "back" && page !== 0) {
                    page--;
                } else if (interaction.customId === "stop") {
                    collector.stop();
                } else if (interaction.customId === "next" && page !== embed.length - 1) {
                    page++;
                } else if (interaction.customId === "last" && page !== embed.length - 1) {
                    page = embed.length - 1;
                }
                await interaction.editReply(getButton(page));
            } else {
                await interaction.reply({
                    content: ctx.locale("buttons.errors.not_author"),
                    ephemeral: true,
                });
            }
        });

        collector.on("end", async () => {
            await msg.edit({ embeds: [embed[page]], components: [] });
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
 * https://discord.gg/ns8CTk9J3e
 */
