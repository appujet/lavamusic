// import type { LavalinkNode } from 'lavalink-client';
import { Event, type Lavamusic } from '../../structures/index';
// import { sendLog } from '../../utils/BotLog';

export default class NodeError extends Event {
	constructor(client: Lavamusic, file: string) {
		super(client, file, {
			name: 'error',
		});
	}

	// public async run(node: LavalinkNode, error: Error): Promise<void> {
	// 	// this.client.logger.error(`Node ${node.id} has an error: ${error.message}`);
	// 	sendLog(this.client, `Node Error: ${node.id}: ${error.message}`, 'error');
	// }
}
