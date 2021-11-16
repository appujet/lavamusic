const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
    name: "ping",
    description: "return websocket ping",

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        await interaction.editReply({ content: "Pining..." }).then(async () => {
            const ping = Date.now() - interaction.createdAt;
            const api_ping = client.ws.ping;

            await interaction.editReply({
                content: "`🏓`",
                embeds: [new MessageEmbed().setAuthor(`Pong`, client.user.displayAvatarURL({ dynamic: true })).setColor(client.embedColor).setFooter(`Requested by ${interaction.member.user.username}`, interaction.member.user.displayAvatarURL({ dynamic: true })).addFields([{ name: "Bot Latency", value: `\`\`\`ini\n[ ${ping}ms ]\n\`\`\``, inline: true }, { name: "API Latency", value: `\`\`\`ini\n[ ${api_ping}ms ]\n\`\`\``, inline: true }]).setTimestamp()]
            });
        })
    }
			}