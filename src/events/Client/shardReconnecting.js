module.exports = {
  name: "shardReconnecting",
  run: async (client, id) => {
  client.logger.log(`Shard #${id} Reconnecting`, "log");
  }
};