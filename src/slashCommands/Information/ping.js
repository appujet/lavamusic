const { EmbedBuilder, CommandInteraction, Client } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

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
            const uptime = moment.duration(message.client.uptime).format(" D[d], H[h], m[m], s[s]");

            await interaction.editReply({
                content: "`🏓`",
                embeds: [new EmbedBuilder()
                    .setAuthor({ name: `Pong`, iconURL: client.user.displayAvatarURL() })
                    .setColor(client.embedColor).setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                    .addFields([{ name: "Bot Latency", value: `\`\`\`ini\n[ ${ping}ms ]\n\`\`\``, inline: true }, 
                                { name: "API Latency", value: `\`\`\`ini\n[ ${api_ping}ms ]\n\`\`\``, inline: true },
                                { name: "Uptime", value: `\`\`\`ini\n[ ${uptime} ]\n\`\`\``, inline: true }])
                    .setFooter({ text: `Requested by ${interaction.member.user.username}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()]
            });
        })
    }
}
