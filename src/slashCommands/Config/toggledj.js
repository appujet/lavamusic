const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
  name: "toggledj",
  description: "Toggle DJ mode",
  userPrems: ["MangeGuild"],
  owner: false,

  run: async (client, interaction) => {
    let data = await db.findOne({ Guild: interaction.guild.id });

    if (!data)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`You don't have any DJ setup in this Guild!`)
            .setColor(client.embedColor),
        ],
      });

    let mode = false;
    if (!data.Mode) mode = true;
    data.Mode = mode;
    await data.save();
    if (mode) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Enabled DJ Mode.`)
            .setColor(client.embedColor),
        ],
      });
    } else {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Disabled DJ Mode.`)
            .setColor(client.embedColor),
        ],
      });
    }
  },
};
