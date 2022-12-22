import { config } from "./src/config.js";
import { ShardingManager } from "discord.js";
import Logger from "./src/structures/Logger.js";
const logger = new Logger({
  displayTimestamp: true,
  displayDate: true,
});
const manager = new ShardingManager("./src/index.js", {
  respawn: true,
  autoSpawn: true,
  token: config.token,
  totalShards: 1,
  shardList: "auto",
});

manager.spawn({ amount: manager.totalShards, delay: null, timeout: -1 }).then((shards) => {
    logger.start(`[CLIENT] ${shards.size} shard(s) spawned.`);
  }).catch((err) => {
    logger.error("[CLIENT] An error has occurred :", err);
  });

manager.on("shardCreate", (shard) => {
  shard.on("ready", () => {
    logger.start(`[CLIENT] Shard ${shard.id} connected to Discord's Gateway.`);
  });
});
