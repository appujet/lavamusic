const { MessageEmbed } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
  name: "removedj",
  description: "Remove Dj Role",
  permission: ["MANAGE_GUILD"],
  owner: false,
  options: [
    {
      name: "dj",
      description: "give me a dj role to delete",
      required: true,
      type: "8",
    },
  ],
  run: async (client, interaction) => {
    let data = await db.findOne({ Guild: interaction.guild.id });
    if (data) {
      await data.delete();
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription(`Successfully removed all DJ Roles.`)
            .setColor(client.embedColor),
        ],
      });
    } else
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription(`You don't have any DJ setup in this Guild!`)
            .setColor(client.embedColor),
        ],
      });
  },
};
