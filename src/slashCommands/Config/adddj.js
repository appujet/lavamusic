const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
  name: "adddj",
  description: "Set Dj Role",
  userPrems: ["MangeGuild"],
  options: [
    {
      name: "dj",
      description: "give me new dj role",
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
            .setDescription(`Successfully Added DJ Role ${role}.`)
            .setColor(client.embedColor),
        ],
      });
    } else {
      let rolecheck = data.Roles.find((x) => x === role.id);
      if (rolecheck)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`Role already exists in the List.`)
              .setColor(client.embedColor),
          ],
        });
      data.Roles.push(role.id);
      await data.save();
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Successfully added new DJ Role ${role}.`)
            .setColor(client.embedColor),
        ],
      });
    }
  },
};
