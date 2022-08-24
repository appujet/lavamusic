const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
  name: "adddj",
  description: "Sets the DJ role.",
  userPrems: ["MangeGuild"],
  options: [
    {
      name: "dj",
      description: "New DJ role.",
      required: true,
      type: ApplicationCommandOptionType.Role,
    },
  ],

  run: async (client, interaction) => {
    let data = await db.findOne({ Guild: interaction.guild.id });

    const role = interaction.options.getRole("dj");

    if (!data) {
      data = new db({
        Guild: interaction.guild.id,
        Roles: [role.id],
        Mode: true,
      });
      await data.save();
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Successfully added DJ role ${role}.`)
            .setColor(client.embedColor),
        ],
      });
    } else {
      let rolecheck = data.Roles.find((x) => x === role.id);
      if (rolecheck)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`Role already exists in the list.`)
              .setColor(client.embedColor),
          ],
        });
      data.Roles.push(role.id);
      await data.save();
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Successfully added the new DJ role ${role}.`)
            .setColor(client.embedColor),
        ],
      });
    }
  },
};
