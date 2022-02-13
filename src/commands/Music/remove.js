const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.remove.name"),
  category: "Music",
  description: i18n.__("cmd.remove.des"),
  args: true,
  usage: i18n.__("cmd.remove.use"),
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

    const position = Number(args[0]) - 1;
    if (position > player.queue.size) {
      const number = position + 1;
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          i18n.__mf("cmd.remove.embed", {
            Number: number,
            Qsize: player.queue.size,
          })
        );
      return message.reply({ embeds: [thing] });
    }

    const song = player.queue[position];
    player.queue.remove(position);

    const emojieject = client.emoji.remove;

    let thing = new MessageEmbed()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(
        `${emojieject} ${i18n.__mf("cmd.remove.embed2", {
          SongTitle: song.title,
          SongUrl: song.uri,
        })}`
      );
    return message.reply({ embeds: [thing] });
  },
};
