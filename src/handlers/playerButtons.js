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
        .setCustomId(`lowvolume_but`)
        .setEmoji({ name: "🔉" })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let row = new ActionRowBuilder().addComponents(lowvolumebut, previousbut, pausebut, skipbut, highvolumebut);
    return row;
}

export { getButtons };