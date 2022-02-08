const { prefix } = require("../../config.js");

module.exports ={
name: "ready",
run: async (client) => {
    client.manager.init(client.user.id);
    client.logger.log(`${client.user.username} online!`, "ready");
    client.logger.log(`Ready on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users`, "ready");
 }
}
