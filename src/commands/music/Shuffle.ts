import { Command, Lavamusic, Context } from '../../structures/index';

export default class Shuffle extends Command {
  constructor(client: Lavamusic) {
    super(client, {
      name: 'shuffle',
      description: {
        content: 'Shuffles the queue',
        examples: ['shuffle'],
        usage: 'shuffle',
      },
      category: 'music',
      aliases: ['sh'],
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
        client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
        user: [],
      },
      slashCommand: true,
      options: [],
    });
  }
  public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {
    const player = client.queue.get(ctx.guild.id);
    const embed = this.client.embed();
    if (!player.queue.length)
      return ctx.sendMessage({
        embeds: [embed.setColor(this.client.color.red).setDescription('There are no songs in the queue.')],
      });
    player.setShuffle(true);

    return ctx.sendMessage({
      embeds: [embed.setColor(this.client.color.main).setDescription(`Shuffled the queue`)],
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
