const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.skipto.name"),
  description: i18n.__("cmd.skipto.des"),
  options: [
    {
      name: i18n.__("cmd.skipto.slash.name"),
      description: i18n.__("cmd.skipto.slash.des"),
      required: true,
      type: "NUMBER",
    },
  ],
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction, prefix) => {
    await interaction.deferReply({});

    const args = interaction.options.getNumber("number");
    const player = interaction.client.manager.get(interaction.guildId);

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(i18n.__("player.nomusic"));
      return await interaction.editReply({ embeds: [thing] });
    }

    const position = Number(args);

    if (!position || position < 0 || position > player.queue.size) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(i18n.__mf("cmd.skipto.embed2", { prefix: prefix }));
      return await interaction.editReply({ embeds: [thing] });
    }
    player.queue.remove(0, position - 1);
    player.stop();

    const emojijump = client.emoji.jump;

    let thing = new MessageEmbed()
      .setDescription(
        `${emojijump} ${i18n.__mf("cmd.skipto.forward", {
          position: position,
        })}`
      )
      .setColor(client.embedColor)
      .setTimestamp();

    return await interaction.editReply({ embeds: [thing] });
  },
};
