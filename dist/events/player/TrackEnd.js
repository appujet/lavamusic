import { Event } from "../../structures/index.js";
export default class TrackEnd extends Event {
    constructor(client, file) {
        super(client, file, {
            name: "trackEnd",
        });
    }
    async run(player, track, dispatcher) {
        dispatcher.previous = dispatcher.current;
        dispatcher.current = null;
        if (dispatcher.loop === 'repeat')
            dispatcher.queue.unshift(track);
        if (dispatcher.loop === 'queue')
            dispatcher.queue.push(track);
        await dispatcher.play();
        if (dispatcher.autoplay) {
            await dispatcher.Autoplay(track);
        }
        const m = await dispatcher.nowPlayingMessage?.fetch().catch(() => { });
        if (m && m.deletable)
            m.delete().catch(() => { });
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
//# sourceMappingURL=TrackEnd.js.map