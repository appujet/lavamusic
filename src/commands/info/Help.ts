import {
  Command,
  type Context,
  type Lavamusic
} from "../../structures/index";
import {
  ContainerBuilder,
  TextDisplayBuilder,
  SectionBuilder,
  MessageFlags
} from "discord.js";

export default class Help extends Command {
  constructor(client: Lavamusic) {
    super(client, {
      name: "help",
      description: {
        content: "cmd.help.description",
        examples: ["help"],
        usage: "help",
      },
      category: "info",
      aliases: ["h"],
      cooldown: 3,
      args: false,
      vote: false,
      player: {
        voice: false,
        dj: false,
        active: false,
        djPerm: null,
      },
      permissions: {
        dev: false,
        client: [
          "SendMessages",
          "ReadMessageHistory",
          "ViewChannel",
          "EmbedLinks",
        ],
        user: [],
      },
      slashCommand: true,
      options: [
        {
          name: "command",
          description: "cmd.help.options.command",
          type: 3,
          required: false,
        },
      ],
    });
  }

  public async run(
    client: Lavamusic,
    ctx: Context,
    args: string[],
  ): Promise<any> {
    const guild = await client.db.get(ctx.guild!.id);
    const commands = this.client.commands.filter(
      (cmd) => cmd.category !== "dev",
    );
    const categories = [...new Set(commands.map((cmd) => cmd.category))];

    if (args[0]) {
      const command = this.client.commands.get(args[0].toLowerCase());
      if (!command) {
        const errorContainer = new ContainerBuilder()
          .setAccentColor(this.client.color.red)
          .addTextDisplayComponents(
            (textDisplay) =>
              textDisplay.setContent(
                `**${ctx.locale("cmd.help.not_found", { cmdName: args[0] })}**`,
              ),
          );
        return await ctx.sendMessage({
          components: [errorContainer],
          flags: MessageFlags.IsComponentsV2,
        });
      }

      const commandHelpContainer = new ContainerBuilder()
        .setAccentColor(client.color.main)
        .addTextDisplayComponents(
          (textDisplay) =>
            textDisplay.setContent(
              `**${ctx.locale("cmd.help.title")} - ${command.name}**\n\n` +
              ctx.locale("cmd.help.help_cmd", {
                description: ctx.locale(command.description.content),
                usage: `${guild?.prefix}${command.description.usage}`,
                examples: command.description.examples
                  .map((example: string) => `${guild.prefix}${example}`)
                  .join(", "),
                aliases: command.aliases
                  .map((alias: string) => `\`${alias}\``)
                  .join(", "),
                category: command.category,
                cooldown: command.cooldown,
                premUser:
                  command.permissions.user.length > 0
                    ? command.permissions.user
                        .map((perm: string) => `\`${perm}\``)
                        .join(", ")
                    : "None",
                premBot: command.permissions.client
                  .map((perm: string) => `\`${perm}\``)
                  .join(", "),
                dev: command.permissions.dev ? "Yes" : "No",
                slash: command.slashCommand ? "Yes" : "No",
                args: command.args ? "Yes" : "No",
                player: command.player.active ? "Yes" : "No",
                dj: command.player.dj ? "Yes" : "No",
                djPerm: command.player.djPerm ? command.player.djPerm : "None",
                voice: command.player.voice ? "Yes" : "No",
              }),
            ),
        );
      return await ctx.sendMessage({
        components: [commandHelpContainer],
        flags: MessageFlags.IsComponentsV2,
      });
    }

    const helpContainer = new ContainerBuilder()
      .setAccentColor(client.color.main)
      .addTextDisplayComponents(
        (textDisplay) =>
          textDisplay.setContent(
            `**${ctx.locale("cmd.help.title")}**\n` +
            ctx.locale("cmd.help.content", {
              bot: client.user?.username,
              prefix: guild.prefix,
            }),
          ),
      );

    categories.forEach((category) => {
      const categoryCommands = commands.filter((cmd) => cmd.category === category);
      if (categoryCommands.length > 0) {
        helpContainer.addSectionComponents(
          new SectionBuilder().addTextDisplayComponents(
            (textDisplay) =>
              textDisplay.setContent(
                `**${category.charAt(0).toUpperCase() + category.slice(1)}**\n` +
                categoryCommands
                  .map((cmd) => `\`${cmd.name}\``)
                  .join(", "),
              ),
          ),
        );
      }
    });

    helpContainer.addTextDisplayComponents(
      (textDisplay) =>
        textDisplay.setContent(
          `\n*${ctx.locale("cmd.help.footer", { prefix: guild.prefix })}*`,
        ),
    );

    return await ctx.sendMessage({
      components: [helpContainer],
      flags: MessageFlags.IsComponentsV2,
    });
  }
}

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/YQsGbTwPBx
 */
