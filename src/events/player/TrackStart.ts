import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type TextChannel } from 'discord.js';
import type { Player, Track, TrackStartEvent } from 'lavalink-client';
import { Event, type Lavamusic } from '../../structures/index';
import { mapTracks } from '@/utils/track';
import { mapTrack } from '@/utils/track';
import { env } from '@/env';

export default class TrackStart extends Event {
	constructor(client: Lavamusic, file: string) {
		super(client, file, {
			name: 'trackStart',
		});
	}

	public async run(player: Player, track: Track | null, _payload: TrackStartEvent): Promise<void> {
		const guild = this.client.guilds.cache.get(player.guildId);
		if (!guild) return;
		if (!player.textChannelId) return;
		if (!track) return;
		const channel = guild.channels.cache.get(player.textChannelId) as TextChannel;
		if (!channel) return;
		const messageId = player.get<string | undefined>('messageId');
		if (messageId) {
			const message = await channel.messages.fetch(messageId).catch(() => {
				null;
			});
			if (message) message.delete().catch(() => null);
		}

		this.client.utils.updateStatus(this.client, guild.id);

		const embed = this.client
			.embed()
			.setColor(this.client.color.main)
			.setDescription(`Now Playing: **[${track.info.title}](${track.info.uri})**`);
		const buttonWebPlayer = new ButtonBuilder()
			.setLabel('Web Player')
			.setStyle(ButtonStyle.Link)
			.setURL(`${env.WEB_PLAYER_URL}/guild/${player.guildId}/room`);

		const message = await channel.send({
			embeds: [embed],
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(buttonWebPlayer)],
		});

		player.set('messageId', message.id);

		this.client.socket.io.to(player?.guildId).emit('player:playerUpdate:success', {
			paused: player?.paused,
			repeat: player?.repeatMode === 'track',
			track: mapTrack(player?.queue?.current as Track ?? {}),
			position: player?.position,
		});

		this.client.socket.io.to(player?.guildId).emit('player:queueUpdate:success', {
			queue: mapTracks(player?.queue?.tracks as Track[] ?? []),
		});
	}
}

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
