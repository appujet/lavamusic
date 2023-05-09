import { Command, Lavamusic, Context } from '../../structures/index.js';
export default class LavaLink extends Command {
    constructor(client: Lavamusic);
    run(client: Lavamusic, ctx: Context): Promise<void>;
}
