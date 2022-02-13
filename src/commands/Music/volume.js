const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.vol.name"),
  aliases: i18n.__("cmd.vol.aliases"),
  category: "Music",
  description: i18n.__("cmd.vol.des"),
  args: false,
  usage: i18n.__("cmd.vol.use"),
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

    const volumeEmoji = client.emoji.volumehigh;

    if (!args.length) {
      let thing = new MessageEmbed()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(
          `${volumeEmoji} ${i18n.__("cmd.vol.embed")} **${player.volume}%**`
        );
      return message.reply({ embeds: [thing] });
    }

    const volume = Number(args[0]);

    if (!volume || volume < 0 || volume > 100) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `${i18n.__("cmd.vol.use1")} ${prefix}${i18n.__("cmd.vol.use")}`
        );
      return message.reply({ embeds: [thing] });
    }

    player.setVolume(volume);

    if (volume > player.volume) {
      var emojivolume = client.emoji.volumehigh;
      let thing = new MessageEmbed()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(
          `${emojivolume} ${i18n.__("cmd.vol.embed")} **${volume}%**`
        );
      return message.reply({ embeds: [thing] });
    } else if (volume < player.volume) {
      var emojivolume = message.client.emoji.volumelow;
      let thing = new MessageEmbed()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(
          `${emojivolume} ${i18n.__("cmd.vol.embed")} **${volume}%**`
        );
      return message.reply({ embeds: [thing] });
    } else {
      let thing = new MessageEmbed()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(
          `${volumeEmoji} ${i18n.__("cmd.vol.embed")} **${volume}%**`
        );
      return message.reply({ embeds: [thing] });
    }
  },
};
