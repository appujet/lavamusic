import { Event, Lavamusic } from '../../structures/index.js';
import { Node } from 'shoukaku';
export default class NodeConnect extends Event {
    constructor(client: Lavamusic, file: string);
    run(node: Node): Promise<void>;
}
