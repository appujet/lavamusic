const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const ms = require("ms");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.seek.name"),
  description: i18n.__("cmd.seek.des"),
  options: [
    {
      name: i18n.__("cmd.seek.slash.name"),
      description: i18n.__("cmd.seek.slash.des"),
      required: true,
      type: "STRING",
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

    const args = interaction.options.getString("time");
    const player = interaction.client.manager.get(interaction.guildId);

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(i18n.__("player.nomusic"));
      return await interaction.editReply({ embeds: [thing] });
    }

    const time = ms(args);
    const position = player.position;
    const duration = player.queue.current.duration;
    const emojiforward = client.emoji.forward;
    const emojirewind = client.emoji.rewind;
    const song = player.queue.current;

    if (time <= duration) {
      if (time > position) {
        player.seek(time);
        let thing = new MessageEmbed()
          .setDescription(
            `${emojiforward} ${i18n.__("cmd.seek.forward")}\n[${song.title}](${
              song.uri
            })\n\`${convertTime(time)} / ${convertTime(duration)}\``
          )
          .setColor(client.embedColor)
          .setTimestamp();
        return await interaction.editReply({ embeds: [thing] });
      } else {
        player.seek(time);
        let thing = new MessageEmbed()
          .setDescription(
            `${emojirewind} ${i18n.__("cmd.seek.rewind")}\n[${song.title}](${
              song.uri
            })\n\`${convertTime(time)} / ${convertTime(duration)}\``
          )
          .setColor(client.embedColor)
          .setTimestamp();
        return await interaction.editReply({ embeds: [thing] });
      }
    } else {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `${i18n.__("cmd.seek.embed")} \`${convertTime(duration)}\``
        );
      return await interaction.editReply({ embeds: [thing] });
    }
  },
};
