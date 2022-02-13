const { MessageEmbed } = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const { progressbar } = require("../../utils/progressbar.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.nowplaying.name"),
  aliases: i18n.__("cmd.nowplaying.aliases"),
  category: "Music",
  description: i18n.__("cmd.nowplaying.des"),
  args: false,
  usage: i18n.__("cmd.nowplaying.use"),
  permission: [],
  owner: false,
  player: true,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {
    const player = message.client.manager.get(message.guild.id);

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(i18n.__("player.noplayer"));
      return message.channel.send({ embeds: [thing] });
    }
    const song = player.queue.current;
    const emojimusic = client.emoji.music;
    var total = song.duration;
    var current = player.position;

    let embed = new MessageEmbed()
      .setDescription(
        `${emojimusic} ${i18n.__mf("cmd.nowplaying.embed", {
          SongTitle: song.title,
          SongUrl: song.uri,
          SongTime: convertTime(song.duration),
          SongReq: song.requester,
          Bar: progressbar(player),
        })}`
      )
      .setThumbnail(song.displayThumbnail("3"))
      .setColor(client.embedColor)
      .addField(
        "\u200b",
        `\`${convertTime(current)} / ${convertTime(total)}\``
      );
    return message.channel.send({ embeds: [embed] });
  },
};
