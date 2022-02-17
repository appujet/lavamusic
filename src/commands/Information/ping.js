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
    .addField( i18n.__("cmd.ping.bot"), `\`\`\`ini\n[ ${ping}ms ]\n\`\`\``, true)
    .addField( i18n.__("cmd.ping.api"), `\`\`\`ini\n[ ${api_ping}ms ]\n\`\`\``, true)
    .setFooter({ text: `${i18n.__("cmd.ping.footer")} ${message.author.username}`, iconURL:  message.author.avatarURL({ dynamic: true })})
    .setTimestamp();

  await msg.edit({
    content: "\`🏓\`",
    embeds: [PingEmbed]
  })
 })
 }
}