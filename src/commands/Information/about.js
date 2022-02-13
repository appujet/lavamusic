const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.about.name"),
  category: "Information",
  aliases: i18n.__("cmd.about.aliases"),
  description: i18n.__("cmd.about.des"),
  args: false,
  usage: "",
  permission: [],
  owner: false,
  execute: async (message, args, client, prefix) => {
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
        name: i18n.__("cmd.about.author"),
        iconURL:
          "https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png",
      })
      .setThumbnail(
        "https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png"
      )
      .setColor("#303236")
      .addField(
        "Creator",
        "[Blacky#6618](https://github.com/brblacky), [Venom#9718](https://github.com/Venom9718/), [AkAbhijit#6892](https://github.com/AkAbhijit/)",
        true
      )
      .addField("Organization", "[Blacky](https://github.com/brblacky)", true)
      .addField(
        "Repository",
        "[Here](https://github.com/brblacky/lavamusic)",
        true
      )
      .addField("\u200b", i18n.__("cmd.about.main")); // don't remove this
    return message.reply({ embeds: [mainPage], components: [row] });
  },
};
