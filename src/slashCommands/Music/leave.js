const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.leave.name"),
  description: i18n.__("cmd.leave.des"),
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({});

    const player = client.manager.get(interaction.guildId);

    const emojiLeave = client.emoji.leave;

    await player.destroy();

    let thing = new MessageEmbed()
      .setColor(client.embedColor)
      .setDescription(
        `${emojiLeave} ${i18n.__mf("cmd.leave.embed", {
          username: client.user.username,
        })}`
      );
    return interaction.editReply({ embeds: [thing] });
  },
};
