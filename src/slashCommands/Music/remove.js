const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.remove.name"),
  description: i18n.__("cmd.remove.des"),
  options: [
    {
      name: i18n.__("cmd.remove.slash.name"),
      description: i18n.__("cmd.remove.slash.des"),
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

    const position = Number(args) - 1;
    if (position > player.queue.size) {
      const number = position + 1;
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          i18n.__mf("cmd.remove.embed", {
            Number: number,
            Qsize: player.queue.size,
          })
        );
      return await interaction.editReply({ embeds: [thing] });
    }

    const song = player.queue[position];
    player.queue.remove(position);

    const emojieject = client.emoji.remove;

    let thing = new MessageEmbed()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(
        `${emojieject} ${i18n.__mf("cmd.remove.embed2", {
          SongTitle: song.title,
          SongUrl: song.uri,
        })}`
      );
    return await interaction.editReply({ embeds: [thing] });
  },
};
