const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "247",
  description: "Toggles if I should stay in VC 24/7 or not",
  permissions: ['MUTE_MEMBERS'],
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
        .setDescription("24/7 mode is **disabled**")
        .setColor(client.embedColor)
      return interaction.editReply({ embeds: [embed] });
    } else {
      player.twentyFourSeven = true;
      const embed = new EmbedBuilder()
        .setDescription("24/7 mode is **enabled**")
        .setColor(client.embedColor)
      return interaction.editReply({ embeds: [embed] });

    }
  }
}
