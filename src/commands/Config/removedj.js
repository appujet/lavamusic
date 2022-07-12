const { MessageEmbed } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
  name: "removedj",
  cooldown: 2,
  category: "Config",
  description: "Remove Dj Role",
  args: false,
  usage: "",
  aliases: ["romdj"],
  permission: ["MANAGE_GUILD"],
  owner: false,
  execute: async (message, args, client, prefix) => {
    let data = await db.findOne({ Guild: message.guild.id });
    if (data) {
      await data.delete();
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setDescription(`Successfully removed all DJ Roles.`)
            .setColor(client.embedColor),
        ],
      });
    } else
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setDescription(`You don't have any DJ setup in this Guild!`)
            .setColor(client.embedColor),
        ],
      });
  },
};
