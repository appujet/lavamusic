const { MessageEmbed } = require("discord.js");
const db = require("../../schema/prefix.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.prefix.name"),
  description: i18n.__("cmd.prefix.des"),
  options: [
    {
      name: i18n.__("cmd.prefix.slash.name"),
      description: i18n.__("cmd.prefix.slash.des"),
      required: true,
      type: "STRING",
    },
  ],
  permission: ["MANAGE_GUILD"],
  run: async (client, interaction, prefix) => {
    await interaction.deferReply({});
    const data = await db.findOne({ Guild: interaction.guildId });
    const pre = interaction.options.getString("prefix");

    if (!pre[0]) {
      const embed = new MessageEmbed()
        .setDescription(i18n.__("cmd.prefix.embed"))
        .setColor(client.embedColor);
      return await interaction.editReply({ embeds: [embed] });
    }
    if (pre[1]) {
      const embed = new MessageEmbed()
        .setDescription(i18n.__("cmd.prefix.embed2"))
        .setColor(client.embedColor);
      return await interaction.editReply({ embeds: [embed] });
    }
    if (pre[0].length > 3) {
      const embed = new MessageEmbed()
        .setDescription(i18n.__("cmd.prefix.embed3"))
        .setColor(client.embedColor);
      return await interaction.editReply({ embeds: [embed] });
    }
    if (data) {
      data.oldPrefix = prefix;
      data.Prefix = pre;
      await data.save();
      const update = new MessageEmbed()
        .setDescription(`${i18n.__("cmd.prefix.embed4")} **${pre}**`)
        .setColor(client.embedColor)
        .setTimestamp();
      return await interaction.editReply({ embeds: [update] });
    } else {
      const newData = new db({
        Guild: interaction.guildId,
        Prefix: pre,
        oldPrefix: prefix,
      });
      await newData.save();
      const embed = new MessageEmbed()
        .setDescription(`${i18n.__("cmd.prefix.embed5")} **${pre}**`)
        .setColor(client.embedColor)
        .setTimestamp();
      return await interaction.editReply({ embeds: [embed] });
    }
  },
};
