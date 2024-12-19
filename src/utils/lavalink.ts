import type { LavalinkNodeOptions, NodeManager } from 'lavalink-client';
import { LavalinkNode } from 'lavalink-client';

export const testConnection = async (nodeOptions: LavalinkNodeOptions, nodeManager: NodeManager) => {
	try {
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
	} catch (error) {
		return {
			status_code: 'failed',
			reason: error instanceof Error ? error.message : 'unknown_error'
		};
	}
};

export const waitForPlayerConnection = async (player: any, maxAttempts = 20) => {
	let attempts = 0;
	while (!player.connected && attempts < maxAttempts) {
		await new Promise(resolve => setTimeout(resolve, 500));
		attempts++;
	}
	return player.connected;
};
