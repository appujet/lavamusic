const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.vol.name"),
  description: i18n.__("cmd.vol.des"),
  options: [
    {
      name: i18n.__("cmd.vol.slash.name"),
      description: i18n.__("cmd.vol.slash.des"),
      required: true,
      type: "NUMBER",
    },
  ],
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String} color
   */

  run: async (client, interaction) => {
    await interaction.deferReply({});

    const emojivolume = client.emoji.volumehigh;

    const vol = interaction.options.getNumber("number");

    const player = client.manager.get(interaction.guildId);
    if (!player.queue.current)
      return await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(i18n.__("player.nomusic")),
        ],
      });
    const volume = Number(vol);
    if (!volume || volume < 0 || volume > 100)
      return await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(
              `${i18n.__("cmd.vol.use1")} ${prefix}${i18n.__(
                "cmd.vol.use"
              )}`
            ),
        ],
      });

    await player.setVolume(volume);
    if (volume > player.volume)
      return await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(
              `${emojivolume} ${i18n.__("cmd.vol.embed")} **${volume}%**`
            ),
        ],
      });
    else if (volume < player.volume)
      return await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(
              `${emojivolume} ${i18n.__("cmd.vol.embed")} **${volume}%**`),
        ],
      });
    else
      await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(`${emojivolume} ${i18n.__("cmd.vol.embed")} **${volume}%**`),
        ],
      });
  },
};
