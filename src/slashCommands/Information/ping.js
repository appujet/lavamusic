const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
    name: "ping",
    description: "Displays the bot's ping.",
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        await interaction.editReply({ content: "Pinging..." }).then(async () => {
            const ping = Date.now() - interaction.createdAt;
            const api_ping = client.ws.ping;

            await interaction.editReply({
                content: "`🏓`",
                embeds: [new EmbedBuilder().setAuthor({ name: `Pong`, iconURL: client.user.displayAvatarURL() }).setColor(client.embedColor).setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() }).addFields([{ name: "Bot Latency", value: `\`\`\`ini\n[ ${ping}ms ]\n\`\`\``, inline: true }, { name: "API Latency", value: `\`\`\`ini\n[ ${api_ping}ms ]\n\`\`\``, inline: true }]).setTimestamp()]
            });
        })
    }
}
