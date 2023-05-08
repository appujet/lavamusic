import { Event, Lavamusic, Dispatcher } from '../../structures/index.js';
import { Player } from 'shoukaku';
import { Song } from '../../structures/Dispatcher.js';
export default class QueueEnd extends Event {
    constructor(client: Lavamusic, file: string);
    run(player: Player, track: Song, dispatcher: Dispatcher): Promise<void>;
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
