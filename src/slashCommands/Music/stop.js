const { EmbedBuilder, CommandInteraction, Client } = require("discord.js");

module.exports = {
  name: "stop",
  description: "Stops the music.",
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
      ephemeral: false,
    });

    const player = interaction.client.manager.get(interaction.guildId);
    if (!player.queue.current) {
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription("There is no music playing.");
      return interaction.editReply({ embeds: [thing] });
    }

    const autoplay = player.get("autoplay");
    if (autoplay) {
      player.set("autoplay", false);
    }

    if (!player.twentyFourSeven) {
        await player.destroy();
    } else {
        await player.stop();
    }

    const emojistop = client.emoji.stop;

    let thing = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(`${emojistop} Stopped the music.`);
    return interaction.editReply({ embeds: [thing] });
  },
};
