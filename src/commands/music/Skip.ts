import { Command, Lavamusic, Context } from '../../structures/index';

export default class Skip extends Command {
  constructor(client: Lavamusic) {
    super(client, {
      name: 'skip',
      description: {
        content: 'Skips the current song',
        examples: ['skip'],
        usage: 'skip',
      },
      category: 'music',
      aliases: ['sk'],
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
    if (player.queue.length === 0)
      return ctx.sendMessage({
        embeds: [embed.setColor(this.client.color.red).setDescription('There are no songs in the queue.')],
      });
    player.skip();
    if (!ctx.isInteraction) {
      ctx.message?.react('👍');
    } else {
      return ctx.sendMessage({
        embeds: [
          embed
            .setColor(this.client.color.main)
            .setDescription(`Skipped [${player.current.info.title}](${player.current.info.uri})`),
        ],
      });
    }
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
