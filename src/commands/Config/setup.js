const { MessageEmbed } = require("discord.js");
const db = require("../../schema/setup");

module.exports = {
    name: "set",
    category: "Config",
    description: "Set Custom Prefix",
    args: false,
    usage: "",
    aliases: ["prefix"],
    permission: [],
    owner: false,
  execute: async (message, args, client) => {
      
    if (!message.member.permissions.has('MANAGE_GUILD')) return message.reply('You must have `Manage Guild` permission to use this command.');
    let data = await db.findOne({ _id: message.guildId });
    
  }
}