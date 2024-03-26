import { Event, Lavamusic } from '../../structures/index.js';
import BotLog from '../../utils/BotLog.js';

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
    }
}
