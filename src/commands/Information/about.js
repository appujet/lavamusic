const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "about",
    category: "Information",
    aliases: ["botinfo", "info"],
    description: "See information about this project.",
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
            .setAuthor({ name: 'LavaMusic', iconURL: 'https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png'})
            .setThumbnail('https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png')
            .setColor(client.embedColor)
            .addFields([
                { name: 'Creator', value: '[Blacky#6618](https://github.com/brblacky) and [Venom#9718](https://github.com/Venom9718/)', inline: true },
                { name: 'Organization', value: '[Blacky](https://github.com/brblacky)', inline: true },
                { name: 'Repository', value: '[Here](https://github.com/brblacky/lavamusic)', inline: true },
                { name: '\u200b', value: `[LavaMusic](https://github.com/brblacky/lavamusic/) was created by [Blacky](https://github.com/brblacky) and [Venom](https://github.com/Venom9718). He really wanted to make his first open source project ever for more coding experience. In this project, he was challenged to make a project with less bugs. Hope you enjoy using LavaMusic!`, inline: true },
            ]);
        return message.reply({embeds: [mainPage], components: [row]});
    }
}
