const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.clearqueue.name"),
  aliases: i18n.__("cmd.clearqueue.aliases"),
  category: "Music",
  description: i18n.__("cmd.clearqueue.des"),
  args: false,
  usage: i18n.__("cmd.clearqueue.use"),
  permission: [],
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = message.client.manager.get(message.guild.id);

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("#FFC942")
        .setDescription(i18n.__("player.nomusic"));
      return message.channel.send({ embeds: [thing] });
    }
    player.queue.clear();

    const emojieject = client.emoji.remove;

    let thing = new MessageEmbed()
      .setColor(message.client.embedColor)
      .setTimestamp()
      .setDescription(`${emojieject} ${i18n.__("cmd.clearqueue.remove")}`);
    return message.reply({ embeds: [thing] });
  },
};
