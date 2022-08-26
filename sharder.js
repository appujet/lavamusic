const { token } = require("./src/config.js");
const { ShardingManager } = require("discord.js");

const manager = new ShardingManager("./src/index.js", {
  respawn: true,
  autoSpawn: true,
  token: token,
  totalShards: 1,
  shardList: "auto",
});

manager
  .spawn({ amount: manager.totalShards, delay: null, timeout: -1 })
  .then((shards) => {
    console.log(`[CLIENT] ${shards.size} shard(s) spawned.`);
  })
  .catch((err) => {
    console.log("[CLIENT] An error has occurred :", err);
  });

manager.on("shardCreate", (shard) => {
  shard.on("ready", () => {
    console.log(`[CLIENT] Shard ${shard.id} connected to Discord's Gateway.`);
  });
});
