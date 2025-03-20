import {
  Command,
  type Context,
  type Lavamusic,
} from "../../structures/index.js";

export default class Speed extends Command {
  constructor(client: Lavamusic) {
    super(client, {
      name: "speed",
      description: {
        content: "cmd.speed.description",
        examples: ["speed 1.5", "speed 1,5"],
        usage: "speed <number>",
      },
      category: "filters",
      aliases: ["spd"],
      cooldown: 3,
      args: true,
      vote: false,
      player: {
        voice: true,
        dj: true,
        active: true,
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
          name: "speed",
          description: "cmd.speed.options.speed",
          type: 3,
          required: true,
        },
      ],
    });
  }

  public async run(
    client: Lavamusic,
    ctx: Context,
    args: string[],
  ): Promise<any> {
    const player = client.manager.getPlayer(ctx.guild!.id);
    if (!player)
      return await ctx.sendMessage(
        ctx.locale("event.message.no_music_playing"),
      );
    const speedString = args[0].replace(",", ".");
    const isValidNumber = /^[0-9]*\.?[0-9]+$/.test(speedString);
    const speed = Number.parseFloat(speedString);

    if (!isValidNumber || Number.isNaN(speed) || speed < 0.25 || speed > 8) {
      await ctx.sendMessage({
        embeds: [
          {
            description: ctx.locale("cmd.speed.messages.invalid_number"),
            color: this.client.color.red,
          },
        ],
      });
      return;
    }

    player.filterManager.setSpeed(speed);
    await ctx.sendMessage({
      embeds: [
        {
          description: ctx.locale("cmd.speed.messages.set_speed", {
            speed,
          }),
          color: this.client.color.main,
        },
      ],
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
 * https://discord.gg/ns8CTk9J3e
 */
