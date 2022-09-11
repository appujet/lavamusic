const { Player, Track, Payload } = require("erela.js");
const MusicBot = require("../../structures/Client");
/**
 *
 * @param {MusicBot} client
 * @param {Player} player
 * @param {Track} track
 * @param {Payload} playload
 * @returns {Promise<void>}
 */
module.exports = async (client, player, track, playload) => {
  const autoplay = player.data.autoplay;
  if (autoplay && player.state === "CONNECTED") {
    const requester = client.user;
    const identifier = player.queue.current.identifier;
    const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
    /**
     * @type {import("erela.js").SearchResult}
     */
    const res = await player.search(search, requester);
    player.queue.add(
      res.tracks[Math.floor(Math.random() * res.tracks.length) ?? 2]
    );
  } else return;
};
