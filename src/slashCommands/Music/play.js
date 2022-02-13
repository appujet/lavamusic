const {
  CommandInteraction,
  Client,
  MessageEmbed,
  Permissions,
} = require("discord.js");

const { convertTime } = require("../../utils/convert.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.play.name"),
  description: i18n.__("cmd.play.des"),
  options: [
    {
      name: i18n.__("cmd.play.slash.name"),
      description: i18n.__("cmd.play.slash.des"),
      required: true,
      type: "STRING",
    },
  ],
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({});

    if (
      !interaction.guild.me.permissions.has([
        Permissions.FLAGS.CONNECT,
        Permissions.FLAGS.SPEAK,
      ])
    )
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(i18n.__("prams.connect")),
        ],
      });
    const { channel } = interaction.member.voice;
    if (
      !interaction.guild.me
        .permissionsIn(channel)
        .has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])
    )
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(i18n.__("prams.vc")),
        ],
      });

    const emojiplaylist = client.emoji.playlist;
    let search = interaction.options.getString("input");
    let res;

    let player = client.manager.create({
      guild: interaction.guildId,
      textChannel: interaction.channelId,
      voiceChannel: interaction.member.voice.channelId,
      selfDeafen: true,
      volume: 100,
    });

    if (player.state != "CONNECTED") await player.connect();

    try {
      res = await player.search(search);
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        return await interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(client.embedColor)
              .setTimestamp()
              .setDescription(i18n.__("cmd.play.slash.error")),
          ],
        });
      }
    } catch (err) {
      console.log(err);
    }
    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        return await interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(client.embedColor)
              .setTimestamp()
              .setDescription(i18n.__("cmd.play.slash.nores")),
          ],
        });
      case "TRACK_LOADED":
        player.queue.add(res.tracks[0], interaction.user);
        if (!player.playing && !player.paused && !player.queue.length)
          player.play();
        const trackload = new MessageEmbed()
          .setColor(client.embedColor)
          .setTimestamp()
          .setDescription(
            `${emojiplaylist} ${i18n.__("cmd.play.slash.embed")} [${
              res.tracks[0].title
            }](${res.tracks[0].uri}) - \`[${convertTime(
              res.tracks[0].duration
            )}]\``
          );
        return await interaction.editReply({ embeds: [trackload] });
      case "PLAYLIST_LOADED":
        player.queue.add(res.tracks);
        await player.play();

        const playlistloadds = new MessageEmbed()
          .setColor(client.embedColor)
          .setTimestamp()
          .setDescription(
            `${emojiplaylist} ${i18n.__("cmd.play.slash.embed1")} [${
              res.playlist.name
            }](${search}) - \`[${convertTime(res.playlist.duration)}]\``
          );
        return await interaction.editReply({ embeds: [playlistloadds] });
      case "SEARCH_RESULT":
        const track = res.tracks[0];
        player.queue.add(track);

        if (!player.playing && !player.paused && !player.queue.length) {
          const searchresult = new MessageEmbed()
            .setColor(client.embedColor)
            .setTimestamp()
            .setThumbnail(track.displayThumbnail("3"))
            .setDescription(
              `${emojiplaylist} ${i18n.__("cmd.play.slash.embed")} [${
                track.title
              }](${track.uri}) - \`[${convertTime(track.duration)}]`
            );

          player.play();
          return await interaction.editReply({ embeds: [searchresult] });
        } else {
          const thing = new MessageEmbed()
            .setColor(client.embedColor)
            .setTimestamp()
            .setThumbnail(track.displayThumbnail("3"))
            .setDescription(
              `${emojiplaylist} ${i18n.__("cmd.play.slash.embed")} [${
                track.title
              }](${track.uri}) - \`[${convertTime(track.duration)}]\``
            );

          return await interaction.editReply({ embeds: [thing] });
        }
    }
  },
};
