import { Event, Lavamusic } from '../../structures/index.js';
import BotLog from '../../utils/BotLog.js';

export default class NodeDisconnect extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'nodeDisconnect',
        });
    }
    public async run(node: string, count: number): Promise<void> {
        this.client.logger.warn(`Node ${node} disconnected ${count} times`);
        BotLog.send(this.client, `Node ${node} disconnected ${count} times`, 'warn');
    }
}
