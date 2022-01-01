module.exports = (client, rateLimitData) => {
  client.logger.log(rateLimitData, "error")
}
