
module.exports = {
  name: "shardReady",
  run: async (client, id) => {
  client.logger.log(`Shard #${id} Ready`, "ready");
  }
};
