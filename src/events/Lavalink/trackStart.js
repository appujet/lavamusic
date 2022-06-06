const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');
const { trackStartEventHandler } = require("../../utils/functions");
const db = require("../../schema/setup");

module.exports = async (client, player, track, payload) => {

  let guild = client.guilds.cache.get(player.guild);
  if (!guild) return;
  let channel = guild.channels.cache.get(player.textChannel);
  if (!channel) return;
  let data = await db.findOne({ Guild: guild.id });
  if (data && data.Channel) {
    let textChannel = guild.channels.cache.get(data.Channel);
    const id = data.Message;
    if (channel.id === textChannel.id) {
      return await trackStartEventHandler(id, textChannel, player, track, client);
    } else {
      await trackStartEventHandler(id, textChannel, player, track, client);
    };
  }

  const emojiplay = client.emoji.play;

  const thing = new MessageEmbed()
    .setDescription(`${emojiplay} Now Playing [${track.title}](${track.uri}) \`[ ${convertTime(track.duration)} ]\``)
    .setColor(client.embedColor)
  const m = channel.send({ embeds: [thing] });
  await player.setNowplayingMessage(m);

};