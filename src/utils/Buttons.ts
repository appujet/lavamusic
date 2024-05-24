import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

function getButtons(): ActionRowBuilder<ButtonBuilder>[] {
    const buttonData = [
        { customId: 'PAUSE_BUT', emoji: '⏸️' },
        { customId: 'PREV_BUT', emoji: '⏮️' },
        { customId: 'SKIP_BUT', emoji: '⏭️' },
        { customId: 'HIGH_VOL_BUT', emoji: '🔊' },
        { customId: 'LOW_VOL_BUT', emoji: '🔉' },
        { customId: 'FORWARD_BUT', emoji: '⏩' },
        { customId: 'STOP_BUT', emoji: '⏹️' },
        { customId: 'LOOP_BUT', emoji: '🔁' },
        { customId: 'SHUFFLE_BUT', emoji: '🔀' },
        { customId: 'REWIND_BUT', emoji: '⏪' },
    ];

    const rows: ActionRowBuilder<ButtonBuilder>[] = [];

    for (let i = 0; i < 2; i++) {
        const rowButtons: ButtonBuilder[] = [];
        for (let j = 0; j < 5; j++) {
            const index = i * 5 + j;
            if (index >= buttonData.length) break;
            const { customId, emoji } = buttonData[index];
            const button = new ButtonBuilder()
                .setCustomId(customId)
                .setEmoji({ name: emoji })
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false);
            rowButtons.push(button);
        }
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(...rowButtons);
        rows.push(row);
    }

    return rows;
}

export { getButtons };

/**
 * Project: lavamusic
 * Author: Appu
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
