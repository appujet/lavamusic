const { CommandInteraction, Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  description: "Skip the song currently playing.",
  userPrems: [],
  player: true,
  dj: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   * @param {String} color 
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });

    const emojiskip = client.emoji.skip;
    const player = client.manager.get(interaction.guildId);

    if (player && player.state !== "CONNECTED") {
      player.destroy();
      return await interaction.editReply({
        embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`Nothing is playing right now.`)]
      }).catch(() => { });
    };
    if (!player.queue) return await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription("Nothing is playing right now.")]
    }).catch(() => { });
    if (!player.queue.current) return await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription("Nothing is playing right now.")]
    }).catch(() => { });

    if (!player.queue.size) return await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription("There are no songs left in the queue to skip.")]
    }).catch(() => { });

    player.stop();
    return await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`${emojiskip} **Skipped** \n[${player.queue.current.title}](${player.queue.current.uri})`)]
    }).catch(() => { });
  }
}
