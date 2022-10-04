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
  const data = await Model.findOne({ 247: true });

  if (!data) return;

  const ModifyObject = {
    guild: data.Guild,
    voicechannel: data.VoiceChannel,
    textchannel: data.TextChannel,
    status: data[247],
  };

  AutoConnect(ModifyObject, client);
};
