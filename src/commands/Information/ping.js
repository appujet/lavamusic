const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
    name: i18n.__("cmd.ping.name"),
    category: "Information",
    description: i18n.__("cmd.ping.des"),
    args: false,
    usage: "",
    permission: [],
    owner: false,
    execute: async (message, args, client, prefix) => {
      
  await message.reply({ content: i18n.__("cmd.ping.content") }).then(async (msg) => {
  const ping = msg.createdAt - message.createdAt;
  const api_ping = client.ws.ping;

  const PingEmbed = new MessageEmbed()
    .setAuthor({ name: i18n.__("cmd.ping.author"), iconURL: client.user.displayAvatarURL()})
    .setColor(client.embedColor)
    .setDescription(`<:music_folder:872774366453186580> **Music:** \`${api_ping}\``);

  await msg.edit({
    content: "pinging...",
    embeds: [PingEmbed]
  })
 })
 }
}