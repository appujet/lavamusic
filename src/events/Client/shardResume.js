module.exports = (client, id, replayedEvents) => {
  client.logger.log(`Shard #${id} Resumed`, "log")
}
