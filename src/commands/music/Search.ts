import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  type TextChannel,
  type VoiceChannel,
  TextDisplayBuilder,
  SectionBuilder,
  MessageFlags,
  ContainerBuilder,
  SeparatorBuilder,
  ThumbnailBuilder,
  ButtonStyle,
  ButtonBuilder,
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
          "AttachFiles",
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
    const query = args.join(" ");
    const memberVoiceChannel = (ctx.member as any).voice
      .channel as VoiceChannel;

    let player = client.manager.getPlayer(ctx.guild!.id);

    if (!player) {
      player = client.manager.createPlayer({
        guildId: ctx.guild!.id,
        voiceChannelId: memberVoiceChannel.id,
        textChannelId: ctx.channel.id,
        selfMute: false,
        selfDeaf: true,
        vcRegion: memberVoiceChannel.rtcRegion!,
      });
    }

    if (!player.connected) {
      try {
        await player.connect();
      } catch (error) {
        console.error("Failed to connect to voice channel:", error);
        return await ctx.sendMessage({
          components: [
            new ContainerBuilder()
              .setAccentColor(this.client.color.red)
              .addTextDisplayComponents(
                (textDisplay) =>
                  textDisplay.setContent(
                    `**${ctx.locale(
                      "cmd.play.errors.vc_connect_fail_title",
                    )}**\n${ctx.locale("cmd.play.errors.vc_connect_fail_description")}`,
                  ),
              ),
          ],
          flags: MessageFlags.IsComponentsV2,
        });
      }
    }

    const response = (await player.search(
      { query: query },
      ctx.author,
    )) as SearchResult;


    if (!response || response.tracks?.length === 0) {
      const noResultsContainer = new ContainerBuilder()
        .setAccentColor(this.client.color.red)
        .addTextDisplayComponents(
          (textDisplay) =>
            textDisplay.setContent(
              `**${ctx.locale(
                "cmd.search.errors.no_results_title",
              )}**\n\n${ctx.locale("cmd.search.errors.no_results_description")}`,
            ),
        );

      return await ctx.sendMessage({
        components: [noResultsContainer],
        flags: MessageFlags.IsComponentsV2,
      });
    }


    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("select-track")
      .setPlaceholder(ctx.locale("cmd.search.select"))
      .addOptions(
        response.tracks.slice(0, 10).map((track: Track, index: number) => ({
          label: `${index + 1}. ${track.info.title.slice(0, 50)}${track.info.title.length > 50 ? "..." : ""}`,
          description: track.info.author.slice(0, 100),
          value: index.toString(),
        })),
      );

    const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectMenu,
    );


    const resultsContainer = new ContainerBuilder()
      .setAccentColor(this.client.color.main) 
      .addTextDisplayComponents( 
        (textDisplay) =>
          textDisplay.setContent(
            `**${ctx.locale(
              "cmd.search.messages.results_found",
              { count: Math.min(response.tracks.length, 10) },
            )}**\n*${ctx.locale("cmd.search.messages.select_prompt")}*`,
          ),
      );


    response.tracks.slice(0, 10).forEach((track: Track, index: number) => {
      const section = new SectionBuilder()
        .addTextDisplayComponents(
          (textDisplay) =>
            textDisplay.setContent(
              `**${index + 1}. [${track.info.title}](${track.info.uri})**\n*${track.info.author}*\n\`${this.client.utils.formatTime(track.info.length)}\``,
            ),
        );


      if (track.info.artworkUrl) {
        section.setThumbnailAccessory(
          (thumbnail) =>
            thumbnail
              .setURL(track.info.artworkUrl)
              .setDescription(`Artwork for ${track.info.title}`),
        );
      }

      resultsContainer.addSectionComponents(section);


      if (index < response.tracks.slice(0, 10).length - 1) {
        resultsContainer.addSeparatorComponents(
          (separator) => separator.setDivider(true),
        );
      }
    });


    const sentMessage = await ctx.sendMessage({
      components: [resultsContainer, actionRow], 
      flags: MessageFlags.IsComponentsV2,
    });


    const collector = (ctx.channel as TextChannel).createMessageComponentCollector({
      filter: (f: any) => f.user.id === ctx.author?.id && f.customId === "select-track",
      max: 1,
      time: 60000, 
      idle: 30000, 
    });

    collector.on("collect", async (int: any) => {
      const selectedIndex = Number.parseInt(int.values[0]);
      const track = response.tracks[selectedIndex];

      await int.deferUpdate();

      if (!track) {
        const errorContainer = new ContainerBuilder()
          .setAccentColor(this.client.color.red)
          .addTextDisplayComponents(
            (textDisplay) =>
              textDisplay.setContent(
                `**${ctx.locale(
                  "cmd.search.errors.invalid_selection_title",
                )}**\n${ctx.locale("cmd.search.errors.invalid_selection_description")}`,
              ),
          );
        return await int.followUp({
          components: [errorContainer],
          flags: MessageFlags.IsComponentsV2,
          flags: MessageFlags.Ephemeral,
        });
      }

      player.queue.add(track);
      if (!player.playing && player.queue.tracks.length > 0)
        await player.play({ paused: false });


      const confirmationContainer = new ContainerBuilder()
        .setAccentColor(this.client.color.green)
        .addTextDisplayComponents(
          (textDisplay) =>
            textDisplay.setContent(
              ctx.locale("cmd.search.messages.added_to_queue", {
                title: track.info.title,
                uri: track.info.uri,
              }),
            ),
        );

      await ctx.editMessage({
        components: [confirmationContainer],
        flags: MessageFlags.IsComponentsV2,
      });

      return collector.stop();
    });

    collector.on("end", async (_collected, reason) => {
      if (reason === "time" || reason === "idle") {
        try {
          const timeoutContainer = new ContainerBuilder()
            .setAccentColor(this.client.color.red)
            .addTextDisplayComponents(
              (textDisplay) =>
                textDisplay.setContent(
                  `**${ctx.locale(
                    "cmd.search.messages.selection_timed_out_title",
                  )}**\n${ctx.locale("cmd.search.messages.selection_timed_out_description")}`,
                ),
            );

          await ctx.editMessage({
            components: [timeoutContainer],
            flags: MessageFlags.IsComponentsV2,
          });
        } catch (error) {
          console.error("Failed to edit message on collector timeout:", error);
          await ctx.followUp({
            embeds: [
              this.client.embed()
                .setDescription(
                  ctx.locale("cmd.search.messages.selection_timed_out_short"),
                )
                .setColor(this.client.color.red),
            ],
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    });
  }
}
