import { Command, Lavamusic, Context } from '../../structures/index';

export default class Autoplay extends Command {
  constructor(client: Lavamusic) {
    super(client, {
      name: 'autoplay',
      description: {
        content: 'Toggles autoplay',
        examples: ['autoplay'],
        usage: 'autoplay',
      },
      category: 'music',
      aliases: ['ap'],
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

    const autoplay = player.autoplay;
    if (!autoplay) {
      embed.setDescription(`Autoplay has been enabled`).setColor(client.color.main);
      player.setAutoplay(true);
    } else {
      embed.setDescription(`Autoplay has been disabled`).setColor(client.color.main);
      player.setAutoplay(false);
    }
    ctx.sendMessage({ embeds: [embed] });
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
