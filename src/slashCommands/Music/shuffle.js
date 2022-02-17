const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.suffle.name"),
  description: i18n.__("cmd.suffle.des"),
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
      ephemeral: false,
    });

    const player = interaction.client.manager.get(interaction.guildId);
    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(i18n.__("player.nomusic"));
      return interaction.editReply({ embeds: [thing] });
    }
    player.queue.shuffle();

    const emojishuffle = client.emoji.shuffle;

    let thing = new MessageEmbed()
      .setDescription(`${emojishuffle} ${i18n.__("cmd.suffle.embed")}`)
      .setColor(client.embedColor)
      .setTimestamp();
    return interaction.editReply({ embeds: [thing] });
  },
};
