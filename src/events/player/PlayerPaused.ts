import type { Player, Track } from "lavalink-client";
import { Event, type Lavamusic } from "../../structures/index";

export default class PlayerPaused extends Event {
	constructor(client: Lavamusic, file: string) {
		super(client, file, {
			name: "playerPaused",
		});
	}

	public async run(player: Player, track: Track): Promise<void> {
		if (!player || !track) return;

		if (player.voiceChannelId) {
			await this.client.utils.setVoiceStatus(
				this.client,
				player.voiceChannelId,
				`⏸️ ${track.info.title}`,
			);
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
 * https://discord.gg/YQsGbTwPBx
 */
