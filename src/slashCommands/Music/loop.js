const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.loop.name"),
  description: i18n.__("cmd.loop.des"),
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

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(i18n.__("player.noplayer"));
      return interaction.editReply({ embeds: [thing] });
    }
    const emojiloop = client.emoji.loop;

    if (args.length && /queue/i.test(args[0])) {
      player.setQueueRepeat(!player.queueRepeat);
      const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
      let thing = new MessageEmbed()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(
          `${emojiloop} ${i18n.__mf("cmd.loop.embed", {
            queueRepeat: queueRepeat,
          })} `
        );
      return interaction.editReply({ embeds: [thing] });
    }

    player.setTrackRepeat(!player.trackRepeat);
    const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
    let thing = new MessageEmbed()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(
        `${emojiloop} ${i18n.__mf("cmd.loop.embed1", {
          trackRepeat: trackRepeat,
        })} `
      );
    return interaction.editReply({ embeds: [thing] });
  },
};
