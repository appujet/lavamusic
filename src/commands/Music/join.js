const { MessageEmbed, Permissions } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.join.name"),
  aliases: i18n.__("cmd.join.aliases"),
  category: "Music",
  description: i18n.__("cmd.join.des"),
  args: false,
  usage: i18n.__("cmd.join.use"),
  permission: [],
  owner: false,
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {
    let player = message.client.manager.get(message.guildId);
    if (player && player.voiceChannel && player.state === "CONNECTED") {
      return await message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(
              i18n.__mf("player.anotherVc", { vc: player.voiceChannel })
            ),
        ],
      });
    } else {
      if (
        !message.guild.me.permissions.has([
          Permissions.FLAGS.CONNECT,
          Permissions.FLAGS.SPEAK,
        ])
      )
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.embedColor)
              .setDescription(i18n.__("prams.connect")),
          ],
        });

      const { channel } = message.member.voice;

      if (
        !message.guild.me
          .permissionsIn(channel)
          .has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])
      )
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.embedColor)
              .setDescription(i18n.__("prams.vc")),
          ],
        });

      const emojiJoin = client.emoji.join;

      player = message.client.manager.create({
        guild: message.guild.id,
        voiceChannel: channel.id,
        textChannel: message.channel.id,
        volume: 80,
        selfDeafen: true,
      });
      if (player && player.state !== "CONNECTED") player.connect();

      let thing = new MessageEmbed()
        .setColor(client.embedColor)
        .setDescription(
          `${emojiJoin} ${i18n.__mf("cmd.join.embed", {
            vcId: channel.id,
            msgChannel: message.channel.id,
          })}`
        );
      return message.reply({ embeds: [thing] });
    }
  },
};
