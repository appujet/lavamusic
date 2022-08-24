const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "shuffle",
  description: "Shuffle the queue.",
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

    const player = interaction.client.manager.get(interaction.guildId);
    if (!player.queue.current) {
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription("There is no music playing.");
      return interaction.editReply({ embeds: [thing] });
    }
    player.queue.shuffle();

    const emojishuffle = client.emoji.shuffle;

    let thing = new EmbedBuilder()
      .setDescription(`${emojishuffle} Shuffled the queue.`)
      .setColor(client.embedColor)
      .setTimestamp()
    return interaction.editReply({ embeds: [thing] });

  }
};
