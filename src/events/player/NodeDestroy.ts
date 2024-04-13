import { Event, Lavamusic } from '../../structures/index.js';
import BotLog from '../../utils/BotLog.js';

let destroyCount = 0;

export default class NodeDestroy extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'nodeDestroy',
        });
    }
    public async run(node: string, code: number, reason: string): Promise<void> {
        this.client.logger.error(`Node ${node} destroyed with code ${code} and reason ${reason}`);
        BotLog.send(
            this.client,
            `Node ${node} destroyed with code ${code} and reason ${reason}`,
            'error'
        );
        destroyCount++;
        if (destroyCount >= 5) {
            this.client.shoukaku.removeNode(node);
            destroyCount = 0;
            this.client.logger.warn(`Node ${node} removed from nodes list due to excessive disconnects`);
            BotLog.send(
                this.client,
                `Node ${node} removed from nodes list due to excessive disconnects`,
                'warn'
            );
        }
    }
}
