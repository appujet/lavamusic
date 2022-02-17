const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.stop.name"),
  category: "Music",
  description: i18n.__("cmd.stop.des"),
  args: false,
  usage: "",
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

    const autoplay = player.get("autoplay");
    if (autoplay === true) {
      player.set("autoplay", false);
    }

    player.stop();
    player.queue.clear();

    const emojistop = client.emoji.stop;

    let thing = new MessageEmbed()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(`${emojistop} ${i18n.__("cmd.stop.embed")}`);
    message.reply({ embeds: [thing] });
  },
};
