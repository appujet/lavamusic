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
        { customId: "LOOP_BUT", emoji: "🔁", style: ButtonStyle.Secondary },
        {
            customId: "PAUSE_BUT",
            emoji: player?.paused ? "▶️" : "⏸️",
            style: player?.paused ? ButtonStyle.Success : ButtonStyle.Secondary,
        },
        { customId: "SHUFFLE_BUT", emoji: "🔀", style: ButtonStyle.Secondary },
        { customId: "SKIP_BUT", emoji: "⏭️", style: ButtonStyle.Secondary },
    ];

    return buttonData.reduce((rows, { customId, emoji, style }, index) => {
        if (index % 5 === 0) rows.push(new ActionRowBuilder<ButtonBuilder>());
        const button = new ButtonBuilder().setCustomId(customId).setEmoji({ name: emoji }).setStyle(style);
        rows[rows.length - 1].addComponents(button);
        return rows;
    }, [] as ActionRowBuilder<ButtonBuilder>[]);
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
