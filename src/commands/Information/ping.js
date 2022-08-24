const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  category: "Information",
  description: "Displays the bot's ping.",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  execute: async (message, args, client, prefix) => {

    await message.reply({ content: "Pinging..." }).then(async (msg) => {
      const ping = msg.createdAt - message.createdAt;
      const api_ping = client.ws.ping;

      const PingEmbed = new EmbedBuilder()
        .setAuthor({ name: "Pong", iconURL: client.user.displayAvatarURL() })
        .setColor(client.embedColor)
        .addFields([
          { name: "Bot Latency", value: `\`\`\`ini\n[ ${ping}ms ]\n\`\`\``, inline: true },
          { name: "API Latency", value: `\`\`\`ini\n[ ${api_ping}ms ]\n\`\`\``, inline: true }
        ])
        .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.avatarURL({ dynamic: true }) })
        .setTimestamp();

      await msg.edit({
        content: "\`🏓\`",
        embeds: [PingEmbed]
      })
    })
  }
}