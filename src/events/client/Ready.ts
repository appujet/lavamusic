import { AutoPoster } from "topgg-autoposter";
import { env } from "../../env";
import { Event, type Lavamusic } from "../../structures/index";
import { Events } from "discord.js";

export default class Ready extends Event {
	constructor(client: Lavamusic, file: string) {
		super(client, file, {
			name: Events.ClientReady,
		});
	}

	public async run(): Promise<void> {
		this.client.logger.success(`${this.client.user?.tag} is ready!`);

		this.client.user?.setPresence({
			activities: [
				{
					name: env.BOT_ACTIVITY,
					type: env.BOT_ACTIVITY_TYPE,
				},
			],
			status: env.BOT_STATUS as any,
		});

		if (env.TOPGG) {
			const autoPoster = AutoPoster(env.TOPGG, this.client);
			setInterval(() => {
				autoPoster.on("posted", (_stats) => {
					this.client.logger.info("Successfully posted stats to Top.gg!");
				});
			}, 86400000); // 24 hours in milliseconds
		} else {
			this.client.logger.warn("Top.gg token not found. Skipping auto poster.");
		}
		await this.client.manager.init({ ...this.client.user!, shards: "auto" });
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
