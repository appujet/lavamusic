import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import type { Dispatcher } from "../structures/index.js";

function getButtons(player: Dispatcher): ActionRowBuilder<ButtonBuilder>[] {
    const buttonData = [
        { customId: "REWIND_BUT", emoji: "⏪", style: ButtonStyle.Secondary },
        { customId: "LOW_VOL_BUT", emoji: "🔉", style: ButtonStyle.Secondary },
        { customId: "STOP_BUT", emoji: "⏹️", style: ButtonStyle.Danger },
        { customId: "HIGH_VOL_BUT", emoji: "🔊", style: ButtonStyle.Secondary },
        { customId: "FORWARD_BUT", emoji: "⏩", style: ButtonStyle.Secondary },
        { customId: "PREV_BUT", emoji: "⏮️", style: ButtonStyle.Secondary },
        {
            customId: "PAUSE_BUT",
            emoji: player?.paused ? "▶️" : "⏸️",
            style: player?.paused ? ButtonStyle.Success : ButtonStyle.Secondary,
        },
        { customId: "SKIP_BUT", emoji: "⏭️", style: ButtonStyle.Secondary },
        { customId: "LOOP_BUT", emoji: "🔁", style: ButtonStyle.Secondary },
        { customId: "SHUFFLE_BUT", emoji: "🔀", style: ButtonStyle.Secondary },
    ];

    const rows = [];

    for (let i = 0; i < 2; i++) {
        const rowButtons = [];
        for (let j = 0; j < 5; j++) {
            const index = i * 5 + j;
            if (index >= buttonData.length) break;
            const { customId, emoji, style } = buttonData[index];
            const button = new ButtonBuilder().setCustomId(customId).setEmoji({ name: emoji }).setStyle(style).setDisabled(false);
            rowButtons.push(button);
        }
        const row = new ActionRowBuilder().addComponents(...rowButtons);
        rows.push(row);
    }

    return rows;
}

export { getButtons };

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
