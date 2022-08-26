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
    interaction.reply({
      content: "Successfully executed",
      ephemeral: true,
    });

    const commandName = interaction.options.getString("commandn_name");
    const command =
      interaction.client.commands.get(commandName) ||
      interaction.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command)
      return interaction.channel.send(
        `There is no command with name or alias \`${commandName}\`, ${interaction.author}!`
      );

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
      interaction.channel.send({
        content: `Successfully reload complete **${commandName}**`,
      });
    } catch (error) {
      console.error(error);
      interaction.channel.send(
        `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``
      );
    }
  },
};
