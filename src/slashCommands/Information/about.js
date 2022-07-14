const { EmbedBuilder, CommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType } = require("discord.js")

module.exports = {
    name: "about",
    description: "See information about this project",
    type: ApplicationCommandType.ChatInput,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        
        const button = new ButtonBuilder()
            .setLabel("Invite")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot`)

        const button2 = new ButtonBuilder()
            .setLabel("GitHub")
            .setStyle(ButtonStyle.Link)
            .setURL("https://github.com/brblacky/lavamusic");

        const button3 = new ButtonBuilder()
            .setLabel("Support Server")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/gfcv94hDhv")

        const row = new ActionRowBuilder().addComponents(button, button2, button3);

        const mainPage = new EmbedBuilder()
            .setAuthor({ name: 'LavaMusic', iconURL: 'https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png' })
            .setThumbnail('https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png')
            .setColor('#303236')
            .addFields([
                { name: 'Creator', value: '[Blacky#6618](https://github.com/brblacky) And [Venom#9718](https://github.com/Venom9718/)', inline: true },
                { name: 'Organization', value: '[Blacky](https://github.com/brblacky)', inline: true },
                { name: 'Repository', value: '[Here](https://github.com/brblacky/lavamusic)', inline: true },
                { name: '\u200b', value: `[LavaMusic](https://github.com/brblacky/lavamusic/) is [Blacky](https://github.com/brblacky) and [Venom](https://github.com/Venom9718)'s Was created by blacky and Venom. He really wants to make his first open source project ever. Because he wants more for coding experience. In this project, he was challenged to make project with less bugs. Hope you enjoy using LavaMusic!`, inline: true },
            ]);
        await interaction.followUp({ embeds: [mainPage], components: [row] });
    }
}
