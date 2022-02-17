const {
  MessageEmbed,
  CommandInteraction,
  Client,
  Permissions,
} = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.join.name"),
  description: i18n.__("cmd.join.des"),
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: false,
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({});
    let player = interaction.client.manager.get(interaction.guildId);
    if (player && player.voiceChannel && player.state === "CONNECTED") {
      return await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(
              i18n.__mf("player.anotherVc", { vc: player.voiceChannel })
            ),
        ],
      });
    } else {
      if (
        !interaction.guild.me.permissions.has([
          Permissions.FLAGS.CONNECT,
          Permissions.FLAGS.SPEAK,
        ])
      )
        return interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(client.embedColor)
              .setDescription(i18n.__("prams.connect")),
          ],
        });
      const { channel } = interaction.member.voice;
      if (
        !interaction.guild.me
          .permissionsIn(channel)
          .has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])
      )
        return interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(client.embedColor)
              .setDescription(i18n.__("prams.vc")),
          ],
        });

      const emojiJoin = client.emoji.join;

      player = client.manager.create({
        guild: interaction.guildId,
        textChannel: interaction.channelId,
        voiceChannel: interaction.member.voice.channelId,
        selfDeafen: true,
        volume: 80,
      });
      if (player && player.state !== "CONNECTED") player.connect();

      let thing = new MessageEmbed()
        .setColor(client.embedColor)
        .setDescription(
          `${emojiJoin} ${i18n.__mf("cmd.join.embed", {
            vcId: channel.id,
            msgChannel: interaction.channel.id,
          })}`
        );
      return interaction.editReply({ embeds: [thing] });
    }
  },
};
