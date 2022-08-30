const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "reload",
  description: "Reload Command",
  default_member_permissions: [],
  ownerOnly: true,
  options: [
    {
      name: "commandn_name",
      description: "Private command for reload commands.",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],

  run: async (client, interaction, prefix) => {
    await interaction.deferReply({
      ephemeral: true
    });

    const commandName = interaction.options.getString("commandn_name");
    const command =
      interaction.client.commands.get(commandName) ||
      interaction.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command)
      return await interaction.editReply({
        content: `There is no command with name or alias \`${commandName}\`, <@${interaction.member.user.id}>!`,
        ephemeral: true
  });

    delete require.cache[
      require.resolve(
        `${process.cwd()}/src/commands/${command.category}/${command.name}.js`
      )
    ];

    try {
      const newCommand = require(`${process.cwd()}/src/commands/${
        command.category
      }/${command.name}.js`);
      interaction.client.commands.set(newCommand.name, newCommand);

      await interaction.editReply({
        content: `Successfully Reloaded **${commandName}** Command`,
        ephemeral: true
      });
    } 
    
    catch (error) {
      console.error(error);
      await interaction.editReply({ 
        content: `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``,
        ephemeral: true 
      });
    }
  },
};