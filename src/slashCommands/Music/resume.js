const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.resume.name"),
  description: i18n.__("cmd.resume.des"),
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({});

    const player = interaction.client.manager.get(interaction.guildId);
    const song = player.queue.current;

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(i18n.__("player.nomusic"));
      return interaction.editReply({ embeds: [thing] });
    }

    const emojiresume = client.emoji.resume;

    if (!player.paused) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${emojiresume} ${i18n.__("cmd.resume.embed")}`)
        .setTimestamp();
      return interaction.editReply({ embeds: [thing] });
    }

    await player.pause(false);

    let thing = new MessageEmbed()
      .setDescription(
        `${emojiresume} ${i18n.__mf("cmd.resume.embed2", {
          SongTitle: song.title,
          SongUrl: song.uri,
        })}`
      )
      .setColor(client.embedColor)
      .setTimestamp();
    return interaction.editReply({ embeds: [thing] });
  },
};
