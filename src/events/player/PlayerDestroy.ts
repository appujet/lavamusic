import type { Player, Track, TrackStartEvent } from 'lavalink-client';
import { Event, type Lavamusic } from '../../structures/index';

export default class PlayerDestroy extends Event {
	constructor(client: Lavamusic, file: string) {
		super(client, file, {
			name: 'playerDestroy',
		});
	}

	public async run(player: Player, _track: Track | null, _payload: TrackStartEvent): Promise<void> {
		this.client.socket.io.to(player?.guildId).emit('player:playerUpdate:success', {
			paused: true,
			repeat: false,
			track: {},
		});

		this.client.socket.io.to(player?.guildId).emit('player:queueUpdate:success', {
			queue: [],
		});

		this.client.socket.io.to(player?.guildId).emit('player:playerStateUpdate:success', {
			isConnected: false,
		});
	}
}