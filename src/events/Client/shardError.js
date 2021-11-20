module.exports = (client, error, id) => {
  client.logger.log(`Shard #${id} Errored`, "error")
}
