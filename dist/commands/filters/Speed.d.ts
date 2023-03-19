import { Command, Lavamusic, Context } from "../../structures/index.js";
export default class Speed extends Command {
    constructor(client: Lavamusic);
    run(client: Lavamusic, ctx: Context, args: string[]): Promise<void>;
}
