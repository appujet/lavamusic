import { Event, Lavamusic, Dispatcher } from "../../structures/index.js";
import { Player } from "shoukaku";
import { Song } from "../../structures/Dispatcher.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from "discord.js"


export default class TrackEnd extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "trackEnd",
        });
    }
    public async run(player: Player, track: Song, channel: TextChannel, dispatcher: Dispatcher): Promise<void> {

        dispatcher.previous = dispatcher.current;
        dispatcher.current = null;
        if (dispatcher.loop === 'repeat') dispatcher.queue.unshift(track);
        if (dispatcher.loop === 'queue') dispatcher.queue.push(track);
        await dispatcher.play();
        await dispatcher.deleteNowPlayingMessage();

    }

}