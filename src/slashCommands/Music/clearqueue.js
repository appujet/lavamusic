const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.clearqueue.name"),
  description: i18n.__("cmd.clearqueue.des"),
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
        .setColor("#FFC942")
        .setDescription(i18n.__("player.nomusic"));
      return interaction.editReply({ embeds: [thing] });
    }
    player.queue.clear();

    const emojieject = client.emoji.remove;

    let thing = new MessageEmbed()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(`${emojieject} ${i18n.__("cmd.clearqueue.remove")}`);
    return interaction.editReply({ embeds: [thing] });
  },
};
