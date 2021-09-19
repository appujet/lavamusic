const { MessageEmbed, CommandInteraction, Client, MessageButton, MessageActionRow } = require("discord.js")

module.exports = {
    name: "about",
    description: "Show Lavamusic project information",

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
   const row = new MessageActionRow()
			.addComponents(
        new MessageButton()
    .setLabel("Invite")
    .setStyle("LINK")
    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot`),
			new MessageButton()
    .setLabel("GitHub")
    .setStyle("LINK")
    .setURL("https://github.com/brblacky/lavamusic"),
    new MessageButton()
    .setLabel("Support")
    .setStyle("LINK")
    .setURL("https://discord.gg/gfcv94hDhv")
			);

      const mainPage = new MessageEmbed()
            .setAuthor('LavaMusic', 'https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png')
            .setThumbnail('https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png')
            .setColor('#303236')
            .addField('Creator', '[Blacky#6618](https://github.com/brblacky) And [Venom#9718](https://github.com/Venom9718/)', true)
            .addField('Organization', '[Blacky](https://github.com/brblacky)', true)
            .addField('Repository', '[Here](https://github.com/brblacky/lavamusic)', true)
            .addField('\u200b',
                `[LavaMusic](https://github.com/brblacky/lavamusic/) is [Blacky](https://github.com/brblacky) and [Venom](https://github.com/Venom9718)'s Was created by blacky and Venom. He really wants to make his first open source project ever. Because he wants more for coding experience. In this project, he was challenged to make project with less bugs. Hope you enjoy using LavaMusic!`
            )
        await interaction.followUp({embeds: [mainPage], components: [row]});
    }
}
