import Event from "../../structures/Event.js";
import Dispatcher from "../../structures/Dispatcher.js";

export default class TrackEnd extends Event {
    constructor(...args) {
        super(...args, {
        });
    }

    /**
     * 
     * @param {import('shoukaku').Player} player 
     * @param {import('shoukaku').Track} track 
     * @param {import('discord.js').TextChannel} channel 
     * @param {import('shoukaku').Track[]} matchedTracks 
     * @param {Dispatcher} dispatcher 
     */
    async run(player, track, channel, dispatcher) {
        dispatcher.previous = dispatcher.current;
        dispatcher.current = null;
        if (dispatcher.loop === 'repeat') dispatcher.queue.unshift(track);
        if (dispatcher.loop === 'queue') dispatcher.queue.push(track);
        await dispatcher.play();
        await dispatcher.deleteNowPlayingMessage();
    }
}
