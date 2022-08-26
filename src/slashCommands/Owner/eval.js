const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { post } = require("node-superfetch");

module.exports = {
  name: "eval",
  description: "Eval Code",
  default_member_permissions: [],
  ownerOnly: true,
  options: [
    {
      name: "code",
      description: "Private command to evaluate a code.",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],

  run: async (client, interaction, prefix) => {
    interaction.reply({
      content: "Successfully executed",
      ephemeral: true,
    });

    const code = interaction.options.getString("code");
    const embed = new EmbedBuilder().addFields([
      { name: "Input", value: "```js\n" + { code } + "```" },
    ]);

    try {
      let evaled;

      if (
        code.includes(`SECRET`) ||
        code.includes(`TOKEN`) ||
        code.includes("process.env")
      ) {
        evaled = "No, shut up, what will you do it with the token?";
      } else {
        evaled = await eval(code);
      }

      if (typeof evaled !== "string")
        evaled = await require("util").inspect(evaled, { depth: 0 });

      let output = clean(evaled);
      if (output.length > 1024) {
        const { body } = await post("https://hastebin.com/documents").send(
          output
        );
        embed
          .addFields([
            {
              name: "Output",
              value: `https://hastebin.com/${body.key}.js`,
              inline: true,
            },
          ])
          .setColor(client.embedColor);
      } else {
        embed
          .addFields([
            { name: "Output", value: "```js\n" + output + "```", inline: true },
          ])
          .setColor(client.embedColor);
      }

      interaction.channel.send({ embeds: [embed] });
    } catch (error) {
      let err = clean(error);
      if (err.length > 1024) {
        const { body } = await post("https://hastebin.com/documents").send(err);
        embed
          .addFields([
            {
              name: "Output",
              value: `https://hastebin.com/${body.key}.js`,
              inline: true,
            },
          ])
          .setColor("Red");
      } else {
        embed
          .addFields([
            { name: "Output", value: "```js\n" + err + "```", inline: true },
          ])
          .setColor("Red");
      }

      interaction.channel.send({ embeds: [embed] });
    }
  },
};

function clean(string) {
  if (typeof text === "string") {
    return string
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  } else {
    return string;
  }
}
