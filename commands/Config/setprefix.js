const { MessageEmbed } = require("discord.js");

const { default_prefix } = require(`${process.cwd()}/config.json`)
module.exports = {
    name: "setprefix",
    category: "Config",
    description: "Set Custom Prefix",
    args: false,
    usage: "",
    aliases: ["prefix"],
    permission: [],
    owner: false,
    async execute(message, args, client) {
      
      if (!message.member.permissions.has('MANAGE_GUILD')) return message.channel.send('You must have `Manage Guild` permission to use this command.');
 if (!args[0]) {
      return message.channel.send({ embed: { color: client.embedColor, description: "Please give the prefix that you want to set" } });
    }

    if (args[1]) {
      return message.channel.send({ embed: { color: client.embedColor, description: "You can not set prefix a double argument" } });
    }

    if (args[0].length > 3) {
      return message.channel.send({ embed: { color: client.embedColor, description: "You can not send prefix more than 3 characters" } });
    }

    if (args.join("") === default_prefix) {
      client.db.delete(`prefix_${message.guild.id}`);
      return await message.channel.send({ embed: { color: client.embedColor, description: "Reseted Prefix " } });
    }

    client.db.set(`prefix_${message.guild.id}`, args[0]);
    await message.channel.send({ embed: { color: client.embedColor, description: `Seted Bot's Prefix to ${args[0]}` } });
  },
};
