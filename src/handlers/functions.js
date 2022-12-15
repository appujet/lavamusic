import Ptefix from "../schemas/prefix.js";
import { BotClient } from "../structures/Client.js";
import { ButtonStyle, CommandInteraction, ButtonBuilder, ActionRowBuilder } from "discord.js";

/**
 * @param {string} guildId
 * @param {BotClient} client
 */
async function getPrefix(guildId, client) {
    let prefix;
    const data = await Ptefix.findOne({ _id: guildId });
    if (data && data.prefix) {
        prefix = data.prefix;
    } else {
        prefix = client.config.prefix;
    }
    return prefix;
}
function checkURL(string) {
    try {
        new URL(string);
        return true;
    } catch (error) {
        return false;
    }
}
function progressBar(current, total, size = 20) {
    let line = "▬";
    let slider = "🔘";
    let bar = current > total ? [line.repeat(size / 2 * 2), (current / total) * 100] : [line.repeat(Math.round(size / 2 * (current / total))).replace(/.$/, slider) + line.repeat(size - Math.round(size * (current / total)) + 1), current / total];

    if (!String(bar).includes(slider)) return `${slider}${line.repeat(size - 1)}`;
    return `${bar[0]}`;

}
/**
 * 
 * @param {number} ms
 * @returns 
 */
function formatTime(ms) {
    const sec = Math.floor((ms / 1000) % 60).toString();
    const min = Math.floor((ms / (1000 * 60)) % 60).toString();
    const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
    if (days !== "0") {
        return `${days.padStart(1, "0")}:${hrs.padStart(2, "0")}:${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
    } else if (hrs !== "0") {
        return `${hrs.padStart(1, "0")}:${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
    } else if (min !== "0") {
        return `${min.padStart(1, "0")}:${sec.padStart(2, "0")}`;
    } else {
        return `${sec.padStart(1, "0")}s`;
    }
}

/**
 * @param {string} string
 */
function stringToTime(string) {
    const time = string.match(/([0-9]+[d,h,m,s])/g);
    if (!time) return 0;
    let ms = 0;
    for (const t of time) {
        const type = t.slice(-1);
        const num = parseInt(t.slice(0, -1));
        switch (type) {
            case "d":
                ms += num * 86400000;
                break;
            case "h":
                ms += num * 3600000;
                break;
            case "m":
                ms += num * 60000;
                break;
            case "s":
                ms += num * 1000;
                break;
            default:
                break;
        }
    }
    return ms;
}
/**
 * 
 * @param {Array} array
 * @param {number} size
 * @returns 
 */
function chunk(array, size) {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
        chunked_arr.push(array.slice(index, size + index));
        index += size;
    }
    return chunked_arr;
}
async function paginate(ctx, embed) {
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
    const getButton = (page) => {
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
    let msg;
    if (ctx instanceof CommandInteraction) {
        msg = await ctx.deferred ? ctx.followUp({ ...msgOptions, fetchReply: true }) : ctx.reply({ ...msgOptions, fetchReply: true });
    } else {
        msg = await ctx.channel.send({ ...msgOptions });
    }
    let author;
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
export {
    getPrefix,
    checkURL,
    progressBar,
    formatTime,
    chunk,
    paginate,
    stringToTime
}