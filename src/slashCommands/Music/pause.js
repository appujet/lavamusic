const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "pause",
  description: "Pauses the music currently playing.",
  userPrems: [],
  dj: true,
  player: true,
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
    const player = interaction.client.manager.get(interaction.guildId);

    if (!player.queue.current) {
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription("There is no music playing.");
      return interaction.editReply({ embeds: [thing] });
    }

    const emojipause = client.emoji.pause;

    if (player.paused) {
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`${emojipause} The music is already paused.`)
        .setTimestamp()
      return interaction.editReply({ embeds: [thing] });
    }

    player.pause(true);

    const song = player.queue.current;

    let thing = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(`${emojipause} **Paused**\n[${song.title}](${song.uri})`)
    return interaction.editReply({ embeds: [thing] });

  }
};
