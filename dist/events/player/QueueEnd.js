import { Event } from '../../structures/index.js';
import { updateSetup } from '../../utils/SetupSystem.js';
export default class QueueEnd extends Event {
    constructor(client, file) {
        super(client, file, {
            name: 'queueEnd',
        });
    }
    async run(player, track, dispatcher) {
        const guild = this.client.guilds.cache.get(dispatcher.guildId);
        if (!guild)
            return;
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
//# sourceMappingURL=QueueEnd.js.map