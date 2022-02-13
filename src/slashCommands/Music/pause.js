const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.pause.name"),
  description: i18n.__("cmd.pause.des"),
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

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(i18n.__("player.noplayer"));
      return interaction.editReply({ embeds: [thing] });
    }

    const emojipause = client.emoji.pause;

    if (player.paused) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${emojipause} ${i18n.__("cmd.pause.embed")}`)
        .setTimestamp();
      return interaction.editReply({ embeds: [thing] });
    }

    await player.pause(true);

    const song = player.queue.current;

    let thing = new MessageEmbed()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(
        `${emojipause} ${i18n.__mf("cmd.pause.embed2", {
          SongTitle: song.title,
          SongUrl: song.uri,
        })}`
      );
    return interaction.editReply({ embeds: [thing] });
  },
};
