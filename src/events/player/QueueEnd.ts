import type { Player } from "shoukaku";
import type { Song } from "../../structures/Dispatcher.js";
import {
    type Dispatcher,
    Event,
    type Lavamusic,
} from "../../structures/index.js";
import { updateSetup } from "../../utils/SetupSystem.js";

export default class QueueEnd extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "queueEnd",
        });
    }

    public async run(
        _player: Player,
        track: Song,
        dispatcher: Dispatcher,
    ): Promise<void> {
        const guild = this.client.guilds.cache.get(dispatcher.guildId);
        if (!guild) return;
        const locale = await this.client.db.getLanguage(guild.id);
        switch (dispatcher.loop) {
            case "repeat":
                dispatcher.queue.unshift(track);
                break;
            case "queue":
                dispatcher.queue.push(track);
                break;
            case "off":
                dispatcher.previous = dispatcher.current;
                dispatcher.current = null;
                break;
        }

        if (dispatcher.autoplay) {
            await dispatcher.Autoplay(track);
        } else {
            dispatcher.autoplay = false;
        }

        await updateSetup(this.client, guild, locale);
        this.client.utils.updateStatus(this.client, guild.id);
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
