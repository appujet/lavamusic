import { Command, Lavamusic, Context } from "../../structures/index.js";

export default class Remove extends Command {
  constructor(client: Lavamusic) {
    super(client, {
      name: "remove",
      description: {
        content: "Removes a song from the queue",
        examples: ["remove 1"],
        usage: "remove <song number>",
      },
      category: "music",
      aliases: ["rm"],
      cooldown: 3,
      args: true,
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
      options: [
        {
          name: "song",
          description: "The song number",
          type: 4,
          required: true,
        },
      ],
    });
  }
  public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {
    const player = client.queue.get(ctx.guild.id);
    const embed = this.client.embed();
    if (!player.queue.length)
      return ctx.sendMessage({
        embeds: [embed.setColor(this.client.color.red).setDescription("There are no songs in the queue.")],
      });
    if (isNaN(Number(args[0])))
      return ctx.sendMessage({
        embeds: [embed.setColor(this.client.color.red).setDescription("That is not a valid number.")],
      });
    if (Number(args[0]) > player.queue.length)
      return ctx.sendMessage({
        embeds: [embed.setColor(this.client.color.red).setDescription("That is not a valid number.")],
      });
    if (Number(args[0]) < 1)
      return ctx.sendMessage({
        embeds: [embed.setColor(this.client.color.red).setDescription("That is not a valid number.")],
      });
    player.remove(Number(args[0]) - 1);
    return ctx.sendMessage({
      embeds: [
        embed.setColor(this.client.color.main).setDescription(`Removed song number ${Number(args[0])} from the queue`),
      ],
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
