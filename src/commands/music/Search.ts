import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  TextDisplayBuilder,
  SectionBuilder,
  ContainerBuilder,
  SeparatorBuilder,
  type TextChannel,
  type VoiceChannel,
} from "discord.js";
import type { SearchResult, Track } from "lavalink-client";
import { Command, type Context, type Lavamusic } from "../../structures/index";

export default class Search extends Command {
  constructor(client: Lavamusic) {
    super(client, {
      name: "search",
      description: {
        content: "cmd.search.description",
        examples: ["search example"],
        usage: "search <song>",
      },
      category: "music",
      aliases: ["sc"],
      cooldown: 3,
      args: true,
      vote: true,
      player: {
        voice: true,
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
          name: "song",
          description: "cmd.search.options.song",
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
    let player = client.manager.getPlayer(ctx.guild!.id);
    const query = args.join(" ");
    const memberVoiceChannel = (ctx.member as any).voice
      .channel as VoiceChannel;

    if (!player)
      player = client.manager.createPlayer({
        guildId: ctx.guild!.id,
        voiceChannelId: memberVoiceChannel.id,
        textChannelId: ctx.channel.id,
        selfMute: false,
        selfDeaf: true,
        vcRegion: memberVoiceChannel.rtcRegion!,
      });
    if (!player.connected) await player.connect();

    const response = (await player.search(
      { query: query },
      ctx.author,
    )) as SearchResult;

    if (!response || response.tracks?.length === 0) {
      
      const noResultsContainer = new ContainerBuilder()
        .setAccentColor(0xFF0000) 
        .addTextDisplayComponents(
          textDisplay => textDisplay
            .setContent(`❌ **No Results Found**\n\nCouldn't find any tracks matching: **${query}**\n\nTry different keywords or check your spelling.`)
        );

      return await ctx.sendMessage({
        components: [noResultsContainer],
        flags: MessageFlags.IsComponentsV2,
      });
    }

    const searchContainer = new ContainerBuilder()
      .setAccentColor(0x0099FF) 
      .addTextDisplayComponents(
        textDisplay => textDisplay
          .setContent(`🔍 **Search Results for:** "${query}"\n\nFound **${response.tracks.length}** tracks. Select one from the menu below:`)
      );

    
    searchContainer.addSeparatorComponents(separator => separator);

    
    const tracksToShow = response.tracks.slice(0, 8);
    tracksToShow.forEach((track: Track, index: number) => {
      searchContainer.addSectionComponents(
        section => section
          .addTextDisplayComponents(
            textDisplay => textDisplay
              .setContent(`**${index + 1}. [${this.truncateText(track.info.title, 60)}](${track.info.uri})**\n🎤 ${this.truncateText(track.info.author, 40)} • ⏱️ ${this.formatDuration(track.info.duration)}`)
          )
      );
    });

    
    searchContainer.addSeparatorComponents(separator => separator);

    // Create select menu for track selection
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("search-track-select")
      .setPlaceholder("🎵 Select a track to add to queue...")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        tracksToShow.map((track: Track, index: number) => ({
          label: `${index + 1}. ${this.truncateText(track.info.title, 80)}`,
          description: `${this.truncateText(track.info.author, 60)} • ${this.formatDuration(track.info.duration)}`,
          value: index.toString(),
          emoji: "🎵"
        }))
      );

    
    const cancelButton = new ButtonBuilder()
      .setCustomId("search-cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("❌");

    const addAllButton = new ButtonBuilder()
      .setCustomId("search-add-all")
      .setLabel(`Add All ${tracksToShow.length}`)
      .setStyle(ButtonStyle.Success)
      .setEmoji("➕");

    
    searchContainer.addActionRowComponents(
      actionRow => actionRow.setComponents(selectMenu)
    );

    searchContainer.addActionRowComponents(
      actionRow => actionRow.setComponents(cancelButton, addAllButton)
    );

    const message = await ctx.sendMessage({
      components: [searchContainer],
      flags: MessageFlags.IsComponentsV2,
    });

    
    const collector = message.createMessageComponentCollector({
      filter: (interaction) => interaction.user.id === ctx.author?.id,
      time: 60000,
      idle: 30000,
    });

    collector.on("collect", async (interaction) => {
      try {
        await interaction.deferUpdate();

        if (interaction.customId === "search-cancel") {
          await this.handleCancel(ctx);
          return collector.stop();
        }

        if (interaction.customId === "search-add-all") {
          await this.handleAddAll(ctx, player, tracksToShow);
          return collector.stop();
        }

        if (interaction.customId === "search-track-select") {
          const selectedIndex = parseInt(interaction.values[0]);
          const track = tracksToShow[selectedIndex];
          await this.handleTrackSelection(ctx, player, track);
          return collector.stop();
        }
      } catch (error) {
        console.error("Error handling search interaction:", error);
        await this.handleError(ctx);
        collector.stop();
      }
    });

    collector.on("end", async (collected, reason) => {
      if (reason === "time" || reason === "idle") {
        await this.handleTimeout(ctx);
      }
    });
  }

  private formatDuration(duration: number): string {
    if (!duration || duration === 0) return "Unknown";
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
  }

  private async handleTrackSelection(ctx: Context, player: any, track: Track) {
    player.queue.add(track);
    if (!player.playing && player.queue.tracks.length > 0) {
      await player.play({ paused: false });
    }

    const successContainer = new ContainerBuilder()
      .setAccentColor(0x00FF00) 
      .addTextDisplayComponents(
        textDisplay => textDisplay
          .setContent(`✅ **Track Added Successfully**\n\n🎵 **[${track.info.title}](${track.info.uri})**\n🎤 **Artist:** ${track.info.author}\n⏱️ **Duration:** ${this.formatDuration(track.info.duration)}\n📍 **Queue Position:** #${player.queue.tracks.length}`)
      );

    await ctx.editMessage({
      components: [successContainer],
      flags: MessageFlags.IsComponentsV2,
    });
  }

  private async handleAddAll(ctx: Context, player: any, tracks: Track[]) {
    tracks.forEach(track => player.queue.add(track));
    if (!player.playing && player.queue.tracks.length > 0) {
      await player.play({ paused: false });
    }

    const successContainer = new ContainerBuilder()
      .setAccentColor(0x00FF00) 
      .addTextDisplayComponents(
        textDisplay => textDisplay
          .setContent(`✅ **All Tracks Added Successfully**\n\n➕ Added **${tracks.length} tracks** to the queue\n📊 **Total Queue Length:** ${player.queue.tracks.length} tracks\n🎵 Queue is now ${player.playing ? 'playing' : 'ready to start'}!`)
      );

    await ctx.editMessage({
      components: [successContainer],
      flags: MessageFlags.IsComponentsV2,
    });
  }

  private async handleCancel(ctx: Context) {
    const cancelContainer = new ContainerBuilder()
      .setAccentColor(0xFF0000) 
      .addTextDisplayComponents(
        textDisplay => textDisplay
          .setContent(`❌ **Search Cancelled**\n\nNo tracks were added to the queue.\nRun the search command again when you're ready!`)
      );

    await ctx.editMessage({
      components: [cancelContainer],
      flags: MessageFlags.IsComponentsV2,
    });
  }

  private async handleTimeout(ctx: Context) {
    const timeoutContainer = new ContainerBuilder()
      .setAccentColor(0xFF8C00) 
      .addTextDisplayComponents(
        textDisplay => textDisplay
          .setContent(`⏰ **Search Menu Expired**\n\nThe search menu has timed out after 60 seconds.\nPlease run the search command again to continue.`)
      );

    await ctx.editMessage({
      components: [timeoutContainer],
      flags: MessageFlags.IsComponentsV2,
    });
  }

  private async handleError(ctx: Context) {
    const errorContainer = new ContainerBuilder()
      .setAccentColor(0xFF0000) 
      .addTextDisplayComponents(
        textDisplay => textDisplay
          .setContent(`❌ **An Error Occurred**\n\nSomething went wrong while processing your selection.\nPlease try running the search command again.`)
      );

    await ctx.editMessage({
      components: [errorContainer],
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
