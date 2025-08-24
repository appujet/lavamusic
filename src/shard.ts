import { ShardingManager } from "discord.js";
import { env } from "./env";
import type Logger from "./structures/Logger";

export async function shardStart(logger: Logger) {
	const manager = new ShardingManager("./dist/LavaClient.js", {
		respawn: true,
		token: env.TOKEN,
		totalShards: "auto",
		shardList: "auto",
	});

	manager.on("shardCreate", (shard) => {
		shard.on("ready", () => {
			logger.start(
				`[CLIENT] Shard ${shard.id} connected to Discord's Gateway.`,
			);
		});
	});

	await manager.spawn();

	logger.start(`[CLIENT] ${manager.totalShards} shard(s) spawned.`);
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
