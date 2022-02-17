const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.skipto.name"),
  aliases: i18n.__("cmd.skipto.aliases"),
  category: "Music",
  description: i18n.__("cmd.skipto.des"),
  args: true,
  usage: i18n.__("cmd.skipto.use"),
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

    const position = Number(args[0]);

    if (!position || position < 0 || position > player.queue.size) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(i18n.__mf("cmd.skipto.embed2", { prefix: prefix }));
      return message.reply({ embeds: [thing] });
    }
    player.queue.remove(0, position - 1);
    player.stop();

    const emojijump = client.emoji.jump;

    let thing = new MessageEmbed()
      .setDescription(
        `${emojijump} ${i18n.__mf("cmd.skipto.embed", { position: position })}`
      )
      .setColor(client.embedColor)
      .setTimestamp();

    return message.reply({ embeds: [thing] });
  },
};
