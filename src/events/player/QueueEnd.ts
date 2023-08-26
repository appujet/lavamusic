import { Event, Lavamusic, Dispatcher } from '../../structures/index';
import { Player } from 'shoukaku';
import { Song } from '../../structures/Dispatcher';
import { updateSetup } from '../../utils/SetupSystem';


export default class QueueEnd extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'queueEnd',
        });
    }
    public async run(player: Player, track: Song, dispatcher: Dispatcher): Promise<void> {
        const guild = this.client.guilds.cache.get(dispatcher.guildId)
        if (!guild) return;
        if (dispatcher.loop === 'repeat') dispatcher.queue.unshift(track);
        if (dispatcher.loop === 'queue') dispatcher.queue.push(track);
        if (dispatcher.autoplay) {
            await dispatcher.Autoplay(track);
        } else {
            dispatcher.autoplay = false;
        }
        if (dispatcher.loop === 'off') {
            dispatcher.previous = dispatcher.current;
            dispatcher.current = null;
        }
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