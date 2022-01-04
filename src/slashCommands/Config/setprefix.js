const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const db = require("../../schema/prefix.js");

module.exports = {
    name: "setprefix",
    description: "Set Custom Prefix",
    options: [
    {
      name: "prefix",
      description: "give me new prefix",
      required: true,
      type: "STRING"
		}
	],

  
   run: async (client, interaction, prefix) => {
   await interaction.deferReply({
        });
   const data = await db.findOne({ Guild: interaction.guildId});
   const pre = interaction.options.getString("prefix");
   if (!interaction.member.permissions.has('MANAGE_GUILD')) return await interaction.editReply({ ephemeral: true, embeds: [new MessageEmbed().setColor(client.embedColor).setDescription("You must have `Manage Guild` permission to use this command.")]
    }).catch(() => {});

  if (!pre[0]) {
    const embed = new MessageEmbed()
        .setDescription("Please give the prefix that you want to set")
        .setColor(client.embedColor)
      return await interaction.editReply({ embeds: [embed] });
    }
    if (pre[1]) {
       const embed = new MessageEmbed()
        .setDescription("You can not set prefix a double argument")
        .setColor(client.embedColor)
      return await interaction.editReply({ embeds: [embed] });
    }
    if (pre[0].length > 3) {
       const embed = new MessageEmbed()
        .setDescription("You can not send prefix more than 3 characters")
        .setColor(client.embedColor)
      return await interaction.editReply({ embeds: [embed] });
    }
    if(data) {
      data.oldPrefix = prefix;
      data.Prefix = pre;
      await data.save()
    const update = new MessageEmbed()
    .setDescription(`Your prefix has been updated to **${pre}**`)
    .setColor(client.embedColor)
    .setTimestamp()
    return await interaction.editReply({embeds: [update]});
   } else {
     data = new db({
       Guild : interaction.guildId,
       Prefix : pre,
       oldPrefix: prefix
      });
      await data.save()
    const MessageEmbed = new MessageEmbed()
    .setDescription(`Custom prefix in this server is now set to **${pre}**`)
    .setColor(client.embedColor)
    .setTimestamp()
    return await interaction.editReply({embeds: [embed]});
   }
 }
}
