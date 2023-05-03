import { Event, Lavamusic } from '../../structures/index.js';
export default class VoiceStateUpdate extends Event {
    constructor(client: Lavamusic, file: string);
    run(oldState: any, newState: any): Promise<void>;
}
