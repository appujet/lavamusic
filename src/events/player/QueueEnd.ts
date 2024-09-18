import type { TextChannel } from "discord.js";
import type { Player, Track, TrackStartEvent } from "lavalink-client";
import { Event, type Lavamusic } from "../../structures/index";

export default class QueueEnd extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "queueEnd",
        });
    }

    public async run(player: Player, _track: Track | null, _payload: TrackStartEvent): Promise<void> {
        const guild = this.client.guilds.cache.get(player.guildId);
        if (!guild) return;

        const messageId = player.get<string | undefined>("messageId");
        if (!messageId) return;

        const channel = guild.channels.cache.get(player.textChannelId) as TextChannel;
        if (!channel) return;

        const message = await channel.messages.fetch(messageId).catch(() => {});
        if (!message) return;

        if (message.editable) {
            await message.edit({ components: [] }).catch(() => {});
        }
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
