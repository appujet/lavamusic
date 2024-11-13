import type { Socket } from 'socket.io';
import type Lavamusic from '@/structures/Lavamusic';
import { mapTrack, mapTracks } from '@/utils/track';
import type { Track } from 'lavalink-client/dist';

export default function playerHandler(socket: Socket, client: Lavamusic) {
	socket.on('player:playerUpdate', async (guildId: string) => {
		if (!guildId) {
			return socket.emit('player:playerUpdate:error', 'No guildId provided');
		}
		socket.join(guildId);
		const player = client.manager.getPlayer(guildId);
		if (!player) {
			return socket.emit('player:playerUpdate:error', `No player found for guild id: ${guildId}`);
		}
		return socket.emit('player:playerUpdate:success', {
			paused: player?.paused,
			repeat: player?.repeatMode === 'track',
			position: player?.position,
			track: player?.queue?.current ? mapTrack(player?.queue?.current as Track) : null,
		});
	});

	socket.on('player:playerStateUpdate', async (guildId: string) => {
		if (!guildId) {
			return socket.emit('player:playerStateUpdate:error', 'No guildId provided');
		}
		socket.join(guildId);
		const player = client.manager.getPlayer(guildId);
		if (!player) {
			return socket.emit('player:playerStateUpdate:error', `No player found for guild id: ${guildId}`);
		}
		return socket.emit('player:playerStateUpdate:success', {
			isConnected: player?.connected,
		});
	});

	socket.on('player:queueUpdate', async (guildId: string) => {
		if (!guildId) {
			return socket.emit('player:queueUpdate:error', 'No guildId provided');
		}
		socket.join(guildId);
		const player = client.manager.getPlayer(guildId);
		if (!player) {
			return socket.emit('player:queueUpdate:error', `No player found for guild id: ${guildId}`);
		}
		const mappedTracks = mapTracks(player?.queue.tracks as Track[] || []);
		return socket.emit('player:queueUpdate:success', {
			queue: mappedTracks,
		});
	});
}
