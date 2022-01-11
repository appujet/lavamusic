module.exports = {
  name: "rateLimit",
  run: async (client, rateLimitData) => {
  client.logger.log(rateLimitData, "error");
  }
};
