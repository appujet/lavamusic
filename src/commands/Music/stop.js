const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "stop",
  category: "Music",
  description: "Stops the music.",
  args: false,
  usage: "",
  userPerms: [],
  dj: true,
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = client.manager.get(message.guild.id);

    if (!player.queue.current) {
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription("There is no music playing.");
      return message.reply({ embeds: [thing] });
    }

    const autoplay = player.get("autoplay");
    if (autoplay) {
      player.set("autoplay", false);
    }

    if (!player.twentyFourSeven) {
        await player.destroy();
    } else {
        await player.stop();
    }

    const emojistop = client.emoji.stop;

    let thing = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(`${emojistop} Stopped the music.`);
    message.reply({ embeds: [thing] });
  },
};
