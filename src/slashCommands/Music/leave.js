const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "leave",
  description: "Disconnects the bot from your voice channel.",
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

    const player = client.manager.get(interaction.guildId);

    const emojiLeave = client.emoji.leave;

    player.destroy();

    let thing = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(`${emojiLeave} **Left the voice channel.**\nThank you for using ${interaction.client.user.username}!`)
    return interaction.editReply({ embeds: [thing] });

  }
};
