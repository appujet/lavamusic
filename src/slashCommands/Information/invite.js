const {
  MessageEmbed,
  CommandInteraction,
  Client,
  MessageButton,
  MessageActionRow,
} = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.invite.name"),
  description: i18n.__("cmd.invite.des"),

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel(i18n.__("button.invite"))
        .setStyle("LINK")
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot`
        ),
      new MessageButton()
        .setLabel(i18n.__("button.github"))
        .setStyle("LINK")
        .setURL("https://github.com/brblacky/lavamusic"),
      new MessageButton()
        .setLabel(i18n.__("button.support"))
        .setStyle("LINK")
        .setURL("https://discord.gg/gfcv94hDhv")
    );

    const mainPage = new MessageEmbed()
      .setAuthor({
        name: i18n.__("cmd.invite.author"),
        iconURL:
          "https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png",
      })
      .setThumbnail(
        "https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png"
      )
      .setColor(client.embedColor)
      .addField(
        i18n.__("cmd.invite.field"),
        `[Here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot)`,
        true
      );
    await interaction.followUp({ embeds: [mainPage], components: [row] });
  },
};
