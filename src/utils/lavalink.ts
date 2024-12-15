import type { LavalinkNodeOptions, NodeManager } from 'lavalink-client';
import { LavalinkNode } from 'lavalink-client';

export const testConnection = async (nodeOptions: LavalinkNodeOptions, nodeManager: NodeManager) => {
	const node = new LavalinkNode(nodeOptions, nodeManager);
	node.connect();

	let attempts = 0;
	const maxAttempts = 20; // 20 attempts * 500ms = 10 seconds
	while (node.connectionStatus === 'CONNECTING') {
		if (attempts >= maxAttempts) {
			return { status_code: 'failed', reason: 'connection_timeout' };
		}
		await new Promise(resolve => setTimeout(resolve, 500));
		attempts++;
	}

	if (node.isAlive) {
		return {
			status_code: 'success',
			node: node,
			info: node?.info,
			stats: node?.stats
		};
	}

	return {
		status_code: 'failed',
		reason: 'failed_to_connect'
	};
};
