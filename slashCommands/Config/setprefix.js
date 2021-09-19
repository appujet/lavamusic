
const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

const { default_prefix } = require(`${process.cwd()}/config.json`)
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

  
   run: async (client, interaction,) => {
   await interaction.deferReply({
            ephemeral: false
        });
     const args = interaction.options.getString("prefix");

      if (!interaction.member.permissions.has('MANAGE_GUILD')) return await interaction.editReply({ ephemeral: true, embeds: [new MessageEmbed().setColor(client.embedColor).setDescription("You must have `Manage Guild` permission to use this command.")]
    }).catch(() => {});

 if (!args[0]) {
    const embed = new MessageEmbed()
        .setDescription("Please give the prefix that you want to set")
        .setColor(client.embedColor)
      return await interaction.editReply({ embeds: [embed] });
    }

    if (args[1]) {
       const embed = new MessageEmbed()
        .setDescription("You can not set prefix a double argument")
        .setColor(client.embedColor)
      return await interaction.editReply({ embeds: [embed] });
    }

    if (args[0].length > 3) {
       const embed = new MessageEmbed()
        .setDescription("You can not send prefix more than 3 characters")
        .setColor(client.embedColor)
      return await interaction.editReply({ embeds: [embed] });
    }

     client.db.delete(`prefix_${interaction.guildId}`);
      
    client.db.set(`prefix_${interaction.guildId}`, args[0]);
    const embed = new MessageEmbed()
       .setDescription(`Set Bot's Prefix to ${args[0]}`)
       .setColor(client.embedColor)
    return await interaction.editReply({ embeds: [embed] });
  },
};


