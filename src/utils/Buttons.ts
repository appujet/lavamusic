import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

function getButtons(): ActionRowBuilder<ButtonBuilder>[] {
    let pausebut = new ButtonBuilder()
        .setCustomId(`PAUSE_BUT`)
        .setEmoji({ name: '⏸️' })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let previousbut = new ButtonBuilder()
        .setCustomId(`PREV_BUT`)
        .setEmoji({ name: '⏮️' })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let skipbut = new ButtonBuilder()
        .setCustomId(`SKIP_BUT`)
        .setEmoji({ name: '⏭️' })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let highvolumebut = new ButtonBuilder()
        .setCustomId(`HIGH_VOL_BUT`)
        .setEmoji({ name: '🔊' })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let lowvolumebut = new ButtonBuilder()
        .setCustomId(`LOW_VOL_BUT`)
        .setEmoji({ name: '🔉' })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let forwardbut = new ButtonBuilder()
        .setCustomId(`FORWARD_BUT`)
        .setEmoji({ name: '⏩' })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let stopbut = new ButtonBuilder()
        .setCustomId(`STOP_BUT`)
        .setEmoji({ name: '⏹️' })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let loopbut = new ButtonBuilder()
        .setCustomId(`LOOP_BUT`)
        .setEmoji({ name: '🔁' })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let shufflebut = new ButtonBuilder()
        .setCustomId(`SHUFFLE_BUT`)
        .setEmoji({ name: '🔀' })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let rewindbut = new ButtonBuilder()
        .setCustomId(`REWIND_BUT`)
        .setEmoji({ name: '⏪' })
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        lowvolumebut,
        previousbut,
        pausebut,
        skipbut,
        highvolumebut
    );
    let row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        rewindbut,
        loopbut,
        stopbut,
        shufflebut,
        forwardbut
    );
    return [row, row2];
}

export { getButtons };
