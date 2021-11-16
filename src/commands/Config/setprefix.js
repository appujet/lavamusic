const { MessageEmbed } = require("discord.js");
const pre = require("../../schema/prefix.js");
const mongoose = require('mongoose')
module.exports = {
    name: "setprefix",
    category: "Config",
    description: "Set Custom Prefix",
    args: false,
    usage: "",
    aliases: ["prefix"],
    permission: [],
    owner: false,
  execute: async (message, args, client) => {
      
    if (!message.member.permissions.has('MANAGE_GUILD')) return message.reply('You must have `Manage Guild` permission to use this command.');
    if (!args[0]) {
    const embed = new MessageEmbed()
        .setDescription("Please give the prefix that you want to set!")
        .setColor(client.embedColor)
      return message.reply({ embeds: [embed] });
    }

    if (args[1]) {
       const embed = new MessageEmbed()
        .setDescription("You can not set prefix a double argument")
        .setColor(client.embedColor)
      return message.reply({ embeds: [embed] });
    }

    if (args[0].length > 3) {
       const embed = new MessageEmbed()
        .setDescription("You can not send prefix more than 3 characters")
        .setColor(client.embedColor)
      return message.reply({ embeds: [embed] });
    }

    const res = await pre.findOne({ guildid: message.guild.id })
      let prefix = args.join(" ");
      let p;
      if (!res) p = ">"
      else p = res.prefix;
      const noperms = new MessageEmbed()
        .setColor("#651FFF")
        .setDescription(`The prefix for this server is \`${p}\``)
      let newprefix = args.join(" ");
      if (!args[0]) return message.reply({embeds: [noperms]});
      else {
        pre.findOne({ guildid: message.guild.id }).then(result => {
          let duck = new pre({
            _id: new mongoose.Types.ObjectId(),
            guildid: message.guild.id,
            prefix: prefix
          })
          let send = new MessageEmbed()
            .setDescription(`Changed prefix to \`${newprefix}\``)
            .setTimestamp()
            .setColor("#651FFF")
          message.reply({embeds: [send]});
          if (!result || result == []) {
            duck.save().catch(console.error);
          } else {
            pre.deleteOne({ guildid: message.guild.id }).catch(console.error)
            duck.save().catch(console.error)
          }
      })}
   }
}
