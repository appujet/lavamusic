const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  aliases: ["s"],
  category: "Music",
  description: "Skip the song currently playing.",
  args: false,
  usage: "",
  userPerms: [],
  dj: true,
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = message.client.manager.get(message.guild.id);

    if (!player.queue.current) {
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription("There is no music playing.");
      return message.reply({ embeds: [thing] });
    }
    const song = player.queue.current;

    player.stop();

    const emojiskip = message.client.emoji.skip;

    let thing = new EmbedBuilder()
      .setDescription(`${emojiskip} **Skipped**\n[${song.title}](${song.uri})`)
      .setColor(message.client.embedColor)
      .setTimestamp();
    return message.reply({ embeds: [thing] }).then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, 3000);
    });
  },
};
