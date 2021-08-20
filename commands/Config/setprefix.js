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
    const embed = new MessageEmbed()
        .setDescription("Please give the prefix that you want to set")
        .setColor(client.embedColor)
      return message.channel.send({ embeds: [embed] });
    }

    if (args[1]) {
       const embed = new MessageEmbed()
        .setDescription("You can not set prefix a double argument")
        .setColor(client.embedColor)
      return message.channel.send({ embeds: [embed] });
    }

    if (args[0].length > 3) {
       const embed = new MessageEmbed()
        .setDescription("You can not send prefix more than 3 characters")
        .setColor(client.embedColor)
      return message.channel.send({ embeds: [embed] });
    }

    if (args.join("") === default_prefix) {
      client.db.delete(`prefix_${message.guild.id}`);
      const embed = new MessageEmbed()
        .setDescription("Reseted Prefix")
        .setColor(client.embedColor)
      return await message.channel.send({ embeds: [embed] });
    }

    client.db.set(`prefix_${message.guild.id}`, args[0]);
    const embed = new MessageEmbed()
       .setDescription(`Set Bot's Prefix to ${args[0]}`)
       .setColor(client.embedColor)
    await message.channel.send({ embeds: [embed] });
  },
};
