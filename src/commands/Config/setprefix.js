const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/prefix.js");
module.exports = {
  name: "setprefix",
  category: "Config",
  description: "Sets a custom prefix.",
  args: false,
  usage: "",
  aliases: ["prefix"],
  userPerms: ['ManageGuild'],
  owner: false,
  execute: async (message, args, client, prefix) => {

    const data = await db.findOne({ Guild: message.guildId });
    const pre = await args.join(" ")
    if (!pre[0]) {
      const embed = new EmbedBuilder()
        .setDescription("Please provide the new prefix to set!")
        .setColor(client.embedColor)
      return message.reply({ embeds: [embed] });
    }
    if (pre[1]) {
      const embed = new EmbedBuilder()
        .setDescription("You can't set a prefix with a double argument!")
        .setColor(client.embedColor)
      return message.reply({ embeds: [embed] });
    }
    if (pre[0].length > 3) {
      const embed = new EmbedBuilder()
        .setDescription("You can't set a prefix with more than 3 characters!")
        .setColor(client.embedColor)
      return message.reply({ embeds: [embed] });
    }
    if (data) {
      data.oldPrefix = prefix;
      data.Prefix = pre;
      await data.save()
      const update = new EmbedBuilder()
        .setDescription(`Your prefix is being updated to **${pre}**`)
        .setColor(client.embedColor)
        .setTimestamp()
      return message.reply({ embeds: [update] });
    } else {
      const newData = new db({
        Guild: message.guildId,
        Prefix: pre,
        oldPrefix: prefix
      });
      await newData.save()
      const embed = new EmbedBuilder()
        .setDescription(`The prefix has been successfully updated to **${pre}**`)
        .setColor(client.embedColor)
        .setTimestamp()
      return message.reply({ embeds: [embed] });

    }
  }
};
