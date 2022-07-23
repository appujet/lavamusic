const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
  name: "removedj",
  description: "Remove Dj Role",
  userPrems: ["MangeGuild"],
  owner: false,
  
  run: async (client, interaction) => {
    let data = await db.findOne({ Guild: interaction.guild.id });
    if (data) {
      await data.delete();
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Successfully removed all DJ Roles.`)
            .setColor(client.embedColor),
        ],
      });
    } else
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`You don't have any DJ setup in this Guild!`)
            .setColor(client.embedColor),
        ],
      });
  },
};
