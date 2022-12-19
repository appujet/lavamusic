import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";


async function getButtons() {
    let pausebut = new ButtonBuilder()
        .setCustomId(`pause_but`)
        .setEmoji({ name: "⏸️" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let previousbut = new ButtonBuilder()
        .setCustomId(`previous_but`)
        .setEmoji({ name: "⏮️" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let skipbut = new ButtonBuilder()
        .setCustomId(`skip_but`)
        .setEmoji({ name: "⏭️" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let highvolumebut = new ButtonBuilder()
        .setCustomId(`highvolume_but`)
        .setEmoji({ name: "🔊" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let lowvolumebut = new ButtonBuilder()
        .setCustomId(`LOW_VOL_BUT`)
        .setEmoji({ name: "🔉" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)
    let forwardbut = new ButtonBuilder()
        .setCustomId(`forward_but`)
        .setEmoji({ name: "⏩" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let stopbut = new ButtonBuilder()
        .setCustomId(`stop_but`)
        .setEmoji({ name: "⏹️" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let loopbut = new ButtonBuilder()
        .setCustomId(`loop_but`)
        .setEmoji({ name: "🔁" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let shufflebut = new ButtonBuilder()
        .setCustomId(`shuffle_but`)
        .setEmoji({ name: "🔀" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let rewindbut = new ButtonBuilder()
        .setCustomId(`rewind_but`)
        .setEmoji({ name: "⏪" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let row = new ActionRowBuilder().addComponents(lowvolumebut, previousbut, pausebut, skipbut, highvolumebut);
    let row2 = new ActionRowBuilder().addComponents(rewindbut, loopbut, stopbut, shufflebut, forwardbut);
    return [row, row2]
}

export { getButtons };