const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.pause.name"),
  category: "Music",
  description: i18n.__("cmd.pause.des"),
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
        .setDescription(i18n.__("player.noplayer"));
      return message.reply({ embeds: [thing] });
    }

    const emojipause = client.emoji.pause;

    if (player.paused) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${emojipause} ${i18n.__("cmd.pause.embed")}`)
        .setTimestamp();
      return message.reply({ embeds: [thing] });
    }
    await player.pause(true);
    const song = player.queue.current;
    let thing = new MessageEmbed()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(
        `${emojipause} ${i18n.__mf("cmd.pause.embed2", {
          SongTitle: song.title,
          SongUrl: song.uri,
        })}`
      );
    return message.reply({ embeds: [thing] });
  },
};
