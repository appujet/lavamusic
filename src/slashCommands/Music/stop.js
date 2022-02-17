const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.stop.name"),
  description: i18n.__("cmd.stop.des"),
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

    const autoplay = player.get("autoplay");
    if (autoplay === true) {
      player.set("autoplay", false);
    }

    player.stop();
    player.queue.clear();

    const emojistop = client.emoji.stop;

    let thing = new MessageEmbed()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(`${emojistop} ${i18n.__("cmd.stop.embed")}`);
    return interaction.editReply({ embeds: [thing] });
  },
};
