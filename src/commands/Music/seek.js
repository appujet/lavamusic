const { MessageEmbed } = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const ms = require("ms");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.seek.name"),
  aliases: [],
  category: "Music",
  description: i18n.__("cmd.seek.des"),
  args: true,
  usage: i18n.__("cmd.seek.use"),
  permission: [],
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = client.manager.get(message.guild.id);

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(i18n.__("player.nomusic"));
      return message.reply({ embeds: [thing] });
    }

    const time = ms(args[0]);
    const position = player.position;
    const duration = player.queue.current.duration;

    const emojiforward = client.emoji.forward;
    const emojirewind = client.emoji.rewind;

    const song = player.queue.current;

    if (time <= duration) {
      if (time > position) {
        player.seek(time);
        let thing = new MessageEmbed()
          .setDescription(
            `${emojiforward} ${i18n.__("cmd.seek.forward")}\n[${song.title}](${
              song.uri
            })\n\`${convertTime(time)} / ${convertTime(duration)}\``
          )
          .setColor(client.embedColor)
          .setTimestamp();
        return message.reply({ embeds: [thing] });
      } else {
        player.seek(time);
        let thing = new MessageEmbed()
          .setDescription(
            `${emojirewind} ${i18n.__("cmd.seek.rewind")}\n[${song.title}](${
              song.uri
            })\n\`${convertTime(time)} / ${convertTime(duration)}\``
          )
          .setColor(client.embedColor)
          .setTimestamp();
        return message.reply({ embeds: [thing] });
      }
    } else {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `${i18n.__("cmd.seek.embed")}\`${convertTime(duration)}\``
        );
      return message.reply({ embeds: [thing] });
    }
  },
};
