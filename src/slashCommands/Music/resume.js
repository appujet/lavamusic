const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "resume",
  description: "Resume playing music.",
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
    const song = player.queue.current;

    if (!player.queue.current) {
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription("There is no music playing.");
      return interaction.editReply({ embeds: [thing] });
    }

    const emojiresume = client.emoji.resume;

    if (!player.paused) {
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`${emojiresume} The player is already **resumed**.`)
        .setTimestamp()
      return interaction.editReply({ embeds: [thing] });
    }

    player.pause(false);

    let thing = new EmbedBuilder()
      .setDescription(`${emojiresume} **Resumed**\n[${song.title}](${song.uri})`)
      .setColor(client.embedColor)
      .setTimestamp()
    return interaction.editReply({ embeds: [thing] });

  }
};
