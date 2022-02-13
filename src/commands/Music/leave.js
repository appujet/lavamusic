const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.leave.name"),
  aliases: i18n.__("cmd.leave.aliases"),
  category: "Music",
  description: i18n.__("cmd.leave.des"),
  args: false,
  usage: "",
  permission: [],
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = message.client.manager.get(message.guild.id);

    const emojiLeave = client.emoji.leave;

    await player.destroy();

    let thing = new MessageEmbed()
      .setColor(client.embedColor)
      .setDescription(
        `${emojiLeave} ${i18n.__mf("cmd.leave.embed", {
          username: client.user.username,
        })}`
      );
    return message.reply({ embeds: [thing] });
  },
};
