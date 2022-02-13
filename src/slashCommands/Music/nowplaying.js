const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const { progressbar } = require("../../utils/progressbar.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.nowplaying.name"),
  description: i18n.__("cmd.nowplaying.des"),
  player: true,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({});
    const player = interaction.client.manager.get(interaction.guildId);

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(i18n.__("player.noplayer"));
      return interaction.editReply({ embeds: [thing] });
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
    return interaction.editReply({ embeds: [embed] });
  },
};
