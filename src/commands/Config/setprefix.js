const { MessageEmbed } = require("discord.js");
const db = require("../../schema/prefix.js");
const i18n = require("../../utils/i18n");

module.exports = {
  name: i18n.__("cmd.prefix.name"),
  category: "Config",
  description: i18n.__("cmd.prefix.des"),
  args: false,
  usage: "",
  aliases: i18n.__("cmd.prefix.aliases"),
  permission: ["MANAGE_GUILD"],
  owner: false,
  execute: async (message, args, client, prefix) => {
    const data = await db.findOne({ Guild: message.guildId });
    const pre = await args.join(" ");
    if (!pre[0]) {
      const embed = new MessageEmbed()
        .setDescription(i18n.__("cmd.prefix.embed"))
        .setColor(client.embedColor);
      return message.reply({ embeds: [embed] });
    }
    if (pre[1]) {
      const embed = new MessageEmbed()
        .setDescription(i18n.__("cmd.prefix.embed2"))
        .setColor(client.embedColor);
      return message.reply({ embeds: [embed] });
    }
    if (pre[0].length > 3) {
      const embed = new MessageEmbed()
        .setDescription(i18n.__("cmd.prefix.embed3"))
        .setColor(client.embedColor);
      return message.reply({ embeds: [embed] });
    }
    if (data) {
      data.oldPrefix = prefix;
      data.Prefix = pre;
      await data.save();
      const update = new MessageEmbed()
        .setDescription(`${i18n.__("cmd.prefix.embed4")} **${pre}**`)
        .setColor(client.embedColor)
        .setTimestamp();
      return message.reply({ embeds: [update] });
    } else {
      const newData = new db({
        Guild: message.guildId,
        Prefix: pre,
        oldPrefix: prefix,
      });
      await newData.save();
      const embed = new MessageEmbed()
        .setDescription(`${i18n.__("cmd.prefix.embed5")} **${pre}**`)
        .setColor(client.embedColor)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }
  },
};
