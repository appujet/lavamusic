import { ButtonStyle, CommandInteraction, ButtonBuilder, ActionRowBuilder } from "discord.js";

export class Utils {
    public static formatTime(ms: number): string {
        const minuteMs = 60 * 1000;
        const hourMs = 60 * minuteMs;
        const dayMs = 24 * hourMs;
        if (ms < minuteMs) {
            return `${ms / 1000}s`;
        } else if (ms < hourMs) {
            return `${Math.floor(ms / minuteMs)}m`;
        } else if (ms < dayMs) {
            return `${Math.floor(ms / hourMs)}h`;
        } else {
            return `${Math.floor(ms / dayMs)}d`;
        }
    }

    public static chunk(array: any[], size: number) {
        const chunked_arr = [];
        let index = 0;
        while (index < array.length) {
            chunked_arr.push(array.slice(index, size + index));
            index += size;
        }
        return chunked_arr;
    }

    public static progressBar(current: number, total: number, size = 20, color = 0x00FF00): string {
        const percent = Math.round((current / total) * 100);
        const filledSize = Math.round((size * current) / total);
        const emptySize = size - filledSize;
        const filledBar = "▓".repeat(filledSize);
        const emptyBar = "‎".repeat(emptySize);
        const progressBar = `${filledBar}${emptyBar} ${percent}%`;
        return progressBar;
    }

    public static async paginate(ctx, embed) {
        if (embed.length < 2) {
            if (ctx instanceof CommandInteraction) {
                ctx.deferred ? ctx.followUp({ embeds: embed }) : ctx.reply({ embeds: embed });
                return;
            } else {
                ctx.channel.send({ embeds: embed });
                return;
            }
        }
        let page = 0;
        const getButton = (page: number) => {
            const firstEmbed = page === 0;
            const lastEmbed = page === embed.length - 1;
            const pageEmbed = embed[page];
            const first = new ButtonBuilder()
                .setCustomId('first')
                .setEmoji('⏪')
                .setStyle(ButtonStyle.Primary);
            if (firstEmbed) first.setDisabled(true);
            const back = new ButtonBuilder()
                .setCustomId('back')
                .setEmoji('◀️')
                .setStyle(ButtonStyle.Primary);
            if (firstEmbed) back.setDisabled(true);
            const next = new ButtonBuilder()
                .setCustomId('next')
                .setEmoji('▶️')
                .setStyle(ButtonStyle.Primary);
            if (lastEmbed) next.setDisabled(true);
            const last = new ButtonBuilder()
                .setCustomId('last')
                .setEmoji('⏩')
                .setStyle(ButtonStyle.Primary);
            if (lastEmbed) last.setDisabled(true);
            const stop = new ButtonBuilder()
                .setCustomId('stop')
                .setEmoji('⏹️')
                .setStyle(ButtonStyle.Danger);
            const row = new ActionRowBuilder()
                .addComponents(first, back, stop, next, last);
            return { embeds: [pageEmbed], components: [row] };
        };
        const msgOptions = getButton(0);
        let msg: any;
        if (ctx instanceof CommandInteraction) {
            msg = await ctx.deferred ? ctx.followUp({ ...msgOptions as any }) : ctx.reply({ ...msgOptions as any });
        } else {
            msg = await ctx.channel.send({ ...msgOptions });
        }
        let author: any;
        if (ctx instanceof CommandInteraction) {
            author = ctx.user;
        } else {
            author = ctx.author;
        }
        const filter = (interaction) => interaction.user.id === author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });
        collector.on('collect', async (interaction) => {
            if (interaction.user.id === author.id) {
                await interaction.deferUpdate();
                if (interaction.customId === 'fast') {
                    if (page !== 0) {
                        page = 0;
                        const newEmbed = getButton(page);
                        await interaction.editReply(newEmbed);
                    }
                }
                if (interaction.customId === 'back') {
                    if (page !== 0) {
                        page--;
                        const newEmbed = getButton(page);
                        await interaction.editReply(newEmbed);
                    }
                }
                if (interaction.customId === 'stop') {
                    collector.stop();
                    await interaction.editReply({ embeds: [embed[page]], components: [] });
                }
                if (interaction.customId === 'next') {
                    if (page !== embed.length - 1) {
                        page++;
                        const newEmbed = getButton(page);
                        await interaction.editReply(newEmbed);
                    }
                }
                if (interaction.customId === 'last') {
                    if (page !== embed.length - 1) {
                        page = embed.length - 1;
                        const newEmbed = getButton(page);
                        await interaction.editReply(newEmbed);
                    }

                }
            } else {
                await interaction.reply({ content: 'You can\'t use this button', ephemeral: true });
            }
        });

        collector.on('end', async () => {
            await msg.edit({ embeds: [embed[page]], components: [] });
        });
    }
}