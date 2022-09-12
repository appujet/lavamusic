const { Collection } = require("discord.js");
const { Player, Queue } = require("erela.js");
/**
 *
 * @param {Player} player
 * @param {Client} client
 * @param {any} payload
 */
module.exports = async (client, player, payload) => {
  const queue = player.queue.current;
  player.destroy();

  //Setting queue for resume playback
  client.disconnects.set(payload.guildId, queue.title);
};
