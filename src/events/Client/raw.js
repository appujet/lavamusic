module.exports = {
  name: "raw",
  run: async (client, data) => {
    client.manager.updateVoiceState(data);
  }
};
