const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "clearqueue",
  description: "Removes all songs in the music queue.",
  userPrems: [],
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
    player.queue.clear();

    const emojieject = client.emoji.remove;

    let thing = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(`${emojieject} Removed all songs from the queue.`)
    return interaction.editReply({ embeds: [thing] });

  }
};
