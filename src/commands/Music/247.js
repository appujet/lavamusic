const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.247.name"),
  aliases: i18n.__("cmd.247.aliases"),
  category: "Music",
  description: i18n.__("cmd.247.des"),
  args: false,
  usage: "",
  permission: [],
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = message.client.manager.players.get(message.guild.id);
    if (player.twentyFourSeven) {
      player.twentyFourSeven = false;
      const embed = new MessageEmbed()
        .setColor(client.embedColor)
        .setDescription(i18n.__("cmd.247.off"));
      return message.reply({ embeds: [embed] });
    } else {
      player.twentyFourSeven = true;
      const embed = new MessageEmbed()
        .setColor(client.embedColor)
        .setDescription(i18n.__("cmd.247.on"));

      return message.reply({ embeds: [embed] });
    }
  },
};
