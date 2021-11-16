const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    category: "Information",
    description: "Check Ping Bot",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    execute: async (message, args, client, prefix) => {
      
  await message.reply({ content: "Pinging..." }).then(async (msg) => {
  const ping = msg.createdAt - message.createdAt;
  const api_ping = client.ws.ping;

  const PingEmbed = new MessageEmbed()
    .setAuthor("Pong", client.user.displayAvatarURL())
    .setColor(client.embedColor)
    .addField("Bot Latency", `\`\`\`ini\n[ ${ping}ms ]\n\`\`\``, true)
    .addField("API Latency", `\`\`\`ini\n[ ${api_ping}ms ]\n\`\`\``, true)
    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL({ dynamic: true }))
    .setTimestamp();

  await msg.edit({
    content: "\`🏓\`",
    embeds: [PingEmbed]
  })
 })
 }
}