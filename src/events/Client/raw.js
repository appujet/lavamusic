const { Client } = require("discord.js");

module.exports = {
  name: "raw",
  /**
    * 
    * @param {Client} client 
    * @param {*} data 
    */
  run: async (client, data) => {
    client.manager.updateVoiceState(data);
  }
};
