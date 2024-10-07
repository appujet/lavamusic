import type { TextChannel } from 'discord.js';
import type { Player } from 'lavalink-client';
import { Event, type Lavamusic } from '../../structures/index';
import { updateSetup } from '../../utils/SetupSystem';

export default class PlayerDisconnect extends Event {
	constructor(client: Lavamusic, file: string) {
		super(client, file, {
			name: 'playerDisconnect',
		});
	}

	public async run(player: Player, _voiceChannelId: string): Promise<void> {
		const guild = this.client.guilds.cache.get(player.guildId);
		if (!guild) return;
		const locale = await this.client.db.getLanguage(player.guildId);
		await updateSetup(this.client, guild, locale);

		const messageId = player.get<string | undefined>('messageId');
		if (!messageId) return;

		const channel = guild.channels.cache.get(player.textChannelId!) as TextChannel;
		if (!channel) return;

		const message = await channel.messages.fetch(messageId).catch(() => {
			null;
		});
		if (!message) return;

		if (message.editable) {
			await message.edit({ components: [] }).catch(() => {
				null;
			});
		}
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
