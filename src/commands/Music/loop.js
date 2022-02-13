const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.loop.name"),
  aliases: i18n.__("cmd.loop.aliases"),
  category: "Music",
  description: i18n.__("cmd.loop.des"),
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
    const emojiloop = client.emoji.loop;

    if (args.length && /queue/i.test(args[0])) {
      player.setQueueRepeat(!player.queueRepeat);
      const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
      let thing = new MessageEmbed()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(
          `${emojiloop} ${i18n.__mf("cmd.loop.embed", {
            queueRepeat: queueRepeat,
          })} `
        );
      return message.reply({ embeds: [thing] });
    }

    player.setTrackRepeat(!player.trackRepeat);
    const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
    let thing = new MessageEmbed()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(
        `${emojiloop} ${i18n.__mf("cmd.loop.embed1", {
          trackRepeat: trackRepeat,
        })} `
      );
    return message.reply({ embeds: [thing] });
  },
};
