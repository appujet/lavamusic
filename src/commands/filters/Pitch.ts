import {
  Command,
  type Context,
  type Lavamusic,
} from "../../structures/index.js";

export default class Pitch extends Command {
  constructor(client: Lavamusic) {
    super(client, {
      name: "pitch",
      description: {
        content: "cmd.pitch.description",
        examples: ["pitch 1", "pitch 1.5", "pitch 1,5"],
        usage: "pitch <number>",
      },
      category: "filters",
      aliases: ["ph"],
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
          name: "pitch",
          description: "cmd.pitch.options.pitch",
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
    const pitchString = args[0].replace(",", ".");
    const isValidNumber = /^[0-9]*\.?[0-9]+$/.test(pitchString);
    const pitch = Number.parseFloat(pitchString);

    if (!isValidNumber || Number.isNaN(pitch) || pitch < 0.25 || pitch > 8) {
      await ctx.sendMessage({
        embeds: [
          {
            description: ctx.locale("cmd.pitch.errors.invalid_number"),
            color: this.client.color.red,
          },
        ],
      });
      return;
    }

    await player.filterManager.setPitch(pitch);
    return await ctx.sendMessage({
      embeds: [
        {
          description: ctx.locale("cmd.pitch.messages.pitch_set", {
            pitch,
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
 * https://discord.gg/YQsGbTwPBx
 */
