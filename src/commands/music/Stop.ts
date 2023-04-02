import { Command, Lavamusic, Context } from "../../structures/index.js";

export default class Stop extends Command {
  constructor(client: Lavamusic) {
    super(client, {
      name: "stop",
      description: {
        content: "Stops the music and clears the queue",
        examples: ["stop"],
        usage: "stop",
      },
      category: "music",
      aliases: ["st"],
      cooldown: 3,
      args: false,
      player: {
        voice: true,
        dj: true,
        active: true,
        djPerm: null,
      },
      permissions: {
        dev: false,
        client: ["SendMessages", "ViewChannel", "EmbedLinks"],
        user: [],
      },
      slashCommand: true,
      options: [],
    });
  }
  public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {
    const player = client.queue.get(ctx.guild.id);
    const embed = this.client.embed();

    player.queue = [];
    player.stop();

    return ctx.sendMessage({
      embeds: [embed.setColor(this.client.color.main).setDescription(`Stopped the music and cleared the queue`)],
    });
  }
}

/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
