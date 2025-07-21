import {
  Command,
  type Context,
  type Lavamusic
} from "../../structures/index";
import {
  ContainerBuilder,
  TextDisplayBuilder,
  SectionBuilder,
  MessageFlags,
  ThumbnailBuilder,
} from "discord.js";

export default class Nowplaying extends Command {
  constructor(client: Lavamusic) {
    super(client, {
      name: "nowplaying",
      description: {
        content: "cmd.nowplaying.description",
        examples: ["nowplaying"],
        usage: "nowplaying",
      },
      category: "music",
      aliases: ["np"],
      cooldown: 3,
      args: false,
      vote: false,
      player: {
        voice: true,
        dj: false,
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
          "AttachFiles", 
        ],
        user: [],
      },
      slashCommand: true,
      options: [],
    });
  }

  public async run(client: Lavamusic, ctx: Context): Promise<any> {
    const player = client.manager.getPlayer(ctx.guild!.id);

    if (!player || !player.queue.current) {
      const noMusicContainer = new ContainerBuilder()
        .setAccentColor(this.client.color.red)
        .addTextDisplayComponents(
          (textDisplay) =>
            textDisplay.setContent(ctx.locale("event.message.no_music_playing")),
        );
      return await ctx.sendMessage({
        components: [noMusicContainer],
        flags: MessageFlags.IsComponentsV2,
      });
    }

    const track = player.queue.current!;
    const position = player.position;
    const duration = track.info.duration;
    const bar = client.utils.progressBar(position, duration, 20);

    const mainSection = new SectionBuilder().addTextDisplayComponents(
        (textDisplay) =>
            textDisplay.setContent(
                `**${ctx.locale("cmd.nowplaying.now_playing")}**\n` +
                `**[${track.info.title}](${track.info.uri})**\n` +
                `*${track.info.author || "Unknown Artist"}*\n\n` +
                `${bar}\n` +
                `\`${client.utils.formatTime(position)} / ${client.utils.formatTime(duration)}\``
            ),
    );

    if (track.info.artworkUrl) {
      mainSection.setThumbnailAccessory(
        (thumbnail) =>
          thumbnail
            .setURL(track.info.artworkUrl)
            .setDescription(`Artwork for ${track.info.title}`),
      );
    }

    const nowPlayingContainer = new ContainerBuilder()
      .setAccentColor(this.client.color.main)
      .addSectionComponents(mainSection);


    if (track.requester) {
      nowPlayingContainer.addSectionComponents(
        new SectionBuilder().addTextDisplayComponents(
          (textDisplay) =>
            textDisplay.setContent(
              ctx.locale("cmd.nowplaying.requested_by", {
                requester: (track.requester as any).id,
              })
            ),
        ),
      );
    }
    
    return await ctx.sendMessage({
      components: [nowPlayingContainer],
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
