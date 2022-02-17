const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.skip.name"),
  aliases: ["s"],
  category: "Music",
  description: i18n.__("cmd.skip.name"),
  args: false,
  usage: "",
  permission: [],
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = message.client.manager.get(message.guild.id);

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(i18n.__("player.nomusic"));
      return message.reply({ embeds: [thing] });
    }
    const song = player.queue.current;

    player.stop();

    const emojiskip = message.client.emoji.skip;

    let thing = new MessageEmbed()
      .setDescription(
        `${emojiskip} **${i18n.__("cmd.skip.embed")}**\n[${song.title}](${
          song.uri
        })`
      )
      .setColor(message.client.embedColor)
      .setTimestamp();
    return message.reply({ embeds: [thing] }).then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, 3000);
    });
  },
};
