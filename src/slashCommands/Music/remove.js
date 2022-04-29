const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "remove",
  description: "Remove song from the queue",
  permissions: [],
  player: true,
  dj: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "number",
      description: "Number of song in queue",
      required: true,
      type: "NUMBER"
    }
  ],

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction, prefix) => {
    await interaction.deferReply({
      ephemeral: false
    });


    const args = interaction.options.getNumber("number");
    const player = interaction.client.manager.get(interaction.guildId);

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription("There is no music playing.");
      return await interaction.editReply({ embeds: [thing] });
    }

    const position = (Number(args) - 1);
    if (position > player.queue.size) {
      const number = (position + 1);
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(`No songs at number ${number}.\nTotal Songs: ${player.queue.size}`);
      return await interaction.editReply({ embeds: [thing] });
    }

    const song = player.queue[position]
    player.queue.remove(position);

    const emojieject = client.emoji.remove;

    let thing = new MessageEmbed()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(`${emojieject} Removed\n[${song.title}](${song.uri})`)
    return await interaction.editReply({ embeds: [thing] });

  }
};
