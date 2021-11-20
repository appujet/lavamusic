module.exports = (client, event, id) => {
  client.logger.log(`Shard #${id} Disconnected`, "warn")
}
