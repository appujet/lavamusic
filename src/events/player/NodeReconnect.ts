import { Event, Lavamusic } from '../../structures/index.js';
import BotLog from '../../utils/BotLog.js';

export default class NodeReconnect extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'nodeReconnect',
        });
    }
    public async run(node: string): Promise<void> {
        this.client.logger.warn(`Node ${node} reconnected`);
        BotLog.send(this.client, `Node ${node} reconnected`, 'warn')
    }
}