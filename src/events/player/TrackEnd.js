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
    async run(player, track, channel, matchedTracks, dispatcher) {
        dispatcher.previous = dispatcher.current;
    }
}
