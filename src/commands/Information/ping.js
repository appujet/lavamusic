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
    .setColor(client.embedColor)
    .setDescription(`<:music:939097896589066300> **Music:** \`${api_ping}ms\``)

  await msg.edit({
    content: "pinging..",
    embeds: [PingEmbed]
  })
 })
 }
}