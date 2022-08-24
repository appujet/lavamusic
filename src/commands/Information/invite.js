const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "invite",
  category: "Information",
  aliases: ["addme"],
  description: "Get the bot's invite link.",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  execute: async (message, args, client, prefix) => {

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot`),
        new ButtonBuilder()
          .setLabel("GitHub")
          .setStyle(ButtonStyle.Link)
          .setURL("https://github.com/brblacky/lavamusic"),
        new ButtonBuilder()
          .setLabel("Support")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/gfcv94hDhv")
      );

    const mainPage = new EmbedBuilder()
      .setAuthor({ name: 'LavaMusic', iconURL: 'https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png' })
      .setThumbnail('https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png')
      .setColor(0x303236)
      .addFields([{ name: 'invite lavamusic', value: `[Here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot)` }])
    message.reply({ embeds: [mainPage], components: [row] })
  }
}
