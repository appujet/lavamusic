const { EmbedBuilder, CommandInteraction, Client } = require("discord.js");

module.exports = {
  name: "autoplay",
  description: "Toggle music autoplay.",
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    const player = client.manager.get(interaction.guild.id);

    const autoplay = player.get("autoplay");

    const emojireplay = client.emoji.autoplay;

    if (!player.queue.current)
      return interaction.reply({
        content: `Please play a song before using this command.`,
      });

    const uri = player.queue.current.uri;
    if (!(uri.includes("youtube.") || uri.includes("youtu.be")))
    return interaction.reply({
      content: `Autoplay feature is currently **not available** for this source.\nSupported sources: \`YouTube\`, \`YouTube Music\``
    });

    await interaction.deferReply();
    if (autoplay) {
      player.set("autoplay", false);
      let thing = new EmbedBuilder()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(`${emojireplay} Autoplay is now **disabled**.`);
      return interaction.editReply({ embeds: [thing] });
    } else {
      const identifier = player.queue.current.identifier;
      player.set("autoplay", true);
      player.set("requester", client.user);
      player.set("identifier", identifier);
      const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
      const res = await player.search(search, interaction.author);
      player.queue.add(
        res.tracks[Math.floor(Math.random() * res.tracks.length) ?? 1]
      );
      let thing = new EmbedBuilder()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(`${emojireplay} Autoplay is now **enabled**.`);

      return interaction.editReply({ embeds: [thing] });
    }
  },
};
