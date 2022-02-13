const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.skip.name"),
  description: i18n.__("cmd.skip.name"),
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   *
   */

  run: async (client, interaction) => {
    await interaction.deferReply({});
    const emojiskip = client.emoji.skip;

    const player = client.manager.get(interaction.guildId);
    if (player && player.state !== "CONNECTED") {
      player.destroy();
      return await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(`Nothing is playing right now.`),
        ],
      });
    }
    if (!player.queue)
      return await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription("Nothing is playing right now."),
        ],
      });
    if (!player.queue.current)
      return await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription("Nothing is playing right now."),
        ],
      });
    if (!player.queue.size)
      return await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription("No songs left in the queue to skip."),
        ],
      });
    await player.stop();
    return await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor(client.embedColor)
          .setDescription(
            `${emojiskip} **Skipped** \n[${player.queue.current.title}](${player.queue.current.uri})`
          ),
      ],
    });
  },
};
