const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "247",
  description: "Sets 24/7 mode, bot stays in voice channel 24/7.",
  default_member_permissions: ['ManageChannels'],
  player: true,
  dj: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });
    let player = interaction.client.manager.get(interaction.guildId);
    if (player.twentyFourSeven) {
      player.twentyFourSeven = false;
      const embed = new EmbedBuilder()
        .setDescription("24/7 mode is **disabled**.")
        .setColor(client.embedColor)
      return interaction.editReply({ embeds: [embed] });
    } else {
      player.twentyFourSeven = true;
      const embed = new EmbedBuilder()
        .setDescription("24/7 mode is **enabled**.")
        .setColor(client.embedColor)
      return interaction.editReply({ embeds: [embed] });

    }
  }
}
