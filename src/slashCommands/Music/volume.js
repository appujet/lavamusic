const { CommandInteraction, Client, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "volume",
  description: "Change the volume of the bot.",
  userPrems: [],
  player: true,
  dj: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "number",
      description: "Volume between 0 and 100",
      required: true,
      type: ApplicationCommandOptionType.Number,
    }
  ],

  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   * @param {String} color 
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });

    const emojivolume = client.emoji.volumehigh;

    const vol = interaction.options.getNumber("number");

    const player = client.manager.get(interaction.guildId);
    if (!player) return await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`There is no music playing.`)]
    }).catch(() => { });
    if (!player.queue.current) return await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`There is no music playing.`)]
    }).catch(() => { });
    const volume = Number(vol);
    if (!volume || volume < 0 || volume > 100) return await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`Usage: ${client.prefix}volume <0 - 100>`)]
    }).catch(() => { });

    player.setVolume(volume);
    if (volume > player.volume) return await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`${emojivolume} Volume set to: **${volume}%**`)]
    }).catch(() => { });
    else if (volume < player.volume) return await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`${emojivolume} Volume set to: **${volume}%**`)]
    }).catch(() => { });
    else
      await interaction.editReply({
        embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`${emojivolume} Volume set to: **${volume}%**`)]
      }).catch(() => { });
  }
}
