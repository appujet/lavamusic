import { Event, Lavamusic, Dispatcher } from '../../structures/index.js';
import { Player } from 'shoukaku';
import { Song } from '../../structures/Dispatcher.js';
import { updateSetup } from '../../utils/SetupSystem.js';


export default class QueueEnd extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
        name: 'queueEnd',
        });
    }
    public async run(player: Player, track: Song, dispatcher: Dispatcher): Promise<void> {
        const guild = this.client.guilds.cache.get(dispatcher.guildId)
        if (!guild) return;
        dispatcher.stopped = true;
        dispatcher.queue = [];
        dispatcher.previous = null;
        dispatcher.current = null;
        dispatcher.loop = 'off';
        dispatcher.matchedTracks = [];
        dispatcher.repeat = 0;
        dispatcher.shuffle = false;
        dispatcher.paused = false;
        dispatcher.filters = [];
        dispatcher.autoplay = false;
        await updateSetup(this.client, guild);
    }
}


/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */