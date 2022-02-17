const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.247.name"),
  description: i18n.__("cmd.247.des"),
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
    if (player.twentyFourSeven) {
      player.twentyFourSeven = false;
      const embed = new MessageEmbed()
        .setDescription(i18n.__("cmd.247.off"))
        .setColor(client.embedColor);
      return interaction.editReply({ embeds: [embed] });
    } else {
      player.twentyFourSeven = true;
      const embed = new MessageEmbed()
        .setDescription(i18n.__("cmd.247.on"))
        .setColor(client.embedColor);
      return interaction.editReply({ embeds: [embed] });
    }
  },
};
