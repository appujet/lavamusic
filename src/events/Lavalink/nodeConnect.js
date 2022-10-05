const Model = require("../../schema/247.js");
const { AutoConnect } = require("../../utils/functions.js");
const MusicBot = require("../../structures/Client.js");

/**
 *
 * @param {MusicBot} client
 * @param {Node} node
 * @returns {Promise<void>}
 */
module.exports = async (client, node) => {
  client.logger.log(`Node "${node.options.identifier}" connected.`, "ready");

  // 247 Connection
  const data = await Model.find({ 247: true });

  if (!data) return;

  const ModifyArray = data.map((value) => ({
    guild: value.Guild,
    voicechannel: value.VoiceChannel,
    textchannel: value.TextChannel,
    status: value[247],
  }));

  for (const obj of ModifyArray) {
    await AutoConnect(obj, client);
  }
};
