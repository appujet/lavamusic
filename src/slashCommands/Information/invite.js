const { EmbedBuilder, CommandInteraction, ButtonStyle, Client, ButtonBuilder, ActionRowBuilder } = require("discord.js")

module.exports = {
    name: "invite",
    description: "Get the bot's invite link.",

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });

           
    const row = new ActionRowBuilder()
    .addComponents(
    new ButtonBuilder()
    .setLabel("Invite")
    .setStyle(ButtonStyle.Link)
    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot`),
	new ButtonBuilder()
    .setLabel("Github")
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
            .setColor(0x303236)
             .addFields([{ name: 'invite lavamusic', value: `[Here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot)`}])
             await interaction.followUp({embeds: [mainPage], components: [row]})
    }
}
