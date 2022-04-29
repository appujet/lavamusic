const { MessageEmbed, CommandInteraction, Client } = require("discord.js");

module.exports = {
  name: "autoplay",
  description: "Toggle music autoplay",
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({});
    const player = interaction.client.manager.get(interaction.guildId);

    const autoplay = player.get("autoplay");

    const emojireplay = client.emoji.autoplay;

    if (autoplay === false) {
      const identifier = player.queue.current.identifier;
      player.set("autoplay", true);
      player.set("requester", interaction.user);
      player.set("identifier", identifier);
      const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
      res = await player.search(search, interaction.user);
      player.queue.add(res.tracks[1]);
      let thing = new MessageEmbed()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(`${emojireplay} Autoplay is now **enabled**`);
      return await interaction.editReply({ embeds: [thing] });
    } else {
      player.set("autoplay", false);
      player.queue.clear();
      let thing = new MessageEmbed()
        .setColor(client.embedColor)
        .setTimestamp()
        .setDescription(`${emojireplay} Autoplay is now **disabled**`);

      return await interaction.editReply({ embeds: [thing] });
    }
  },
};
