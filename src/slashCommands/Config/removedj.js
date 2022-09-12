const { EmbedBuilder, CommandInteraction } = require("discord.js");
const MusicBot = require("../../structures/Client");
const db = require("../../schema/dj");

module.exports = {
  name: "removedj",
  description: "Removes the DJ role.",
  userPrems: ["MangeGuild"],
  owner: false,

  /**
   *
   * @param {MusicBot} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    let data = await db.findOne({ Guild: interaction.guild.id });
    if (data) {
      await data.delete();
      return await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`Successfully removed all DJ roles.`)
              .setColor(client.embedColor),
          ],
        })
        .catch((err) => console.error("Promise Rejected At", err));
    } else
      return await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `You don't have any DJ roles setup in this guild!`
              )
              .setColor(client.embedColor),
          ],
        })
        .catch((err) => console.error("Promise Rejected At", err));
  },
};
