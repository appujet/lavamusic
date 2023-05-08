import { Event, Lavamusic } from '../../structures/index.js';
export default class SetupButtons extends Event {
    constructor(client: Lavamusic, file: string);
    run(interaction: any): Promise<void>;
}
