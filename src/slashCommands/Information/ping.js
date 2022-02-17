const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.ping.name"),
  description: i18n.__("cmd.ping.des"),

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });
    await interaction
      .editReply({ content: i18n.__("cmd.ping.content") })
      .then(async () => {
        const ping = Date.now() - interaction.createdAt;
        const api_ping = client.ws.ping;

        await interaction.editReply({
          content: "`🏓`",
          embeds: [
            new MessageEmbed()
              .setAuthor({
                name: i18n.__("cmd.ping.author"),
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setColor(client.embedColor)
              .setFooter({
                text: `${i18n.__("cmd.ping.footer")} ${
                  interaction.member.user.username
                }`,
                iconURL: interaction.member.user.displayAvatarURL({
                  dynamic: true,
                }),
              })
              .addFields([
                {
                  name: i18n.__("cmd.ping.bot"),
                  value: `\`\`\`ini\n[ ${ping}ms ]\n\`\`\``,
                  inline: true,
                },
                {
                  name: i18n.__("cmd.ping.api"),
                  value: `\`\`\`ini\n[ ${api_ping}ms ]\n\`\`\``,
                  inline: true,
                },
              ])
              .setTimestamp(),
          ],
        });
      });
  },
};
