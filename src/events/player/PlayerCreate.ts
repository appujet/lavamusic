import type { Player, Track, TrackStartEvent } from 'lavalink-client';
import { Event, type Lavamusic } from '../../structures/index';
import type { TextChannel } from 'discord.js';

export default class PlayerCreate extends Event {
	constructor(client: Lavamusic, file: string) {
		super(client, file, {
			name: 'playerCreate',
		});
	}

	public async run(player: Player, _track: Track | null, _payload: TrackStartEvent): Promise<void> {
		const channel = this.client.channels.cache.get(player.textChannelId!) as TextChannel;
		if (!channel) return;

		this.client.socket.io.to(player?.guildId).emit('player:playerStateUpdate:success', {
			isConnected: true,
		});

		const announcements = await this.client.dbNew.getAnnouncement();
		announcements?.forEach(async announcement => {
			if (announcement?.Description) {
				const embed = this.client
					.embed()
					.setColor(this.client.color.main)
					.setTitle(announcement?.Title)
					.setDescription(announcement.Description);

				await channel.send({ embeds: [embed] }).catch(() => null);
			}
		});
	}
}