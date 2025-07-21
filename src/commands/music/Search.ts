import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,   
  type TextChannel,
  type VoiceChannel,
  TextDisplayBuilder,
  SectionBuilder,
  MessageFlags,
  ContainerBuilder,
  SeparatorBuilder, 
  ThumbnailBuilder,
} from "discord.js";
import type { SearchResult, Track } from "lavalink-client";
import { Command, type Context, type Lavamusic } from "../../structures/index";


const TRACKS_PER_PAGE = 4; //adjust this to change how many tracks are shown per page

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


  private generatePageComponents(
    client: Lavamusic,
    ctx: Context,
    tracks: Track[],
    currentPage: number,
    maxPages: number,
  ) {
    const startIndex = currentPage * TRACKS_PER_PAGE;
    const endIndex = startIndex + TRACKS_PER_PAGE;
    const tracksOnPage = tracks.slice(startIndex, endIndex);

    // Główny kontener na wyniki wyszukiwania
    const resultsContainer = new ContainerBuilder()
      .setAccentColor(client.color.main)
      .addTextDisplayComponents(
        (textDisplay) =>
          textDisplay.setContent(
            `**${ctx.locale(
              "cmd.search.messages.results_found",
              { count: tracks.length }, 
            )}**\n*${ctx.locale("cmd.search.messages.select_prompt")}*` +
            `\n\n**${ctx.locale("cmd.search.messages.page_info", {
              currentPage: currentPage + 1,
              maxPages: maxPages,
            })}**`,
          ),
      );

    // Dodaj każdy utwór jako Section z miniaturą
    tracksOnPage.forEach((track: Track, index: number) => {
      const globalIndex = startIndex + index; 
      const section = new SectionBuilder().addTextDisplayComponents(
        (textDisplay) =>
          textDisplay.setContent(
            `**${globalIndex + 1}. [${track.info.title}](${track.info.uri})**\n*${track.info.author}*\n\`${client.utils.formatTime(track.info.length)}\``,
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
    });


    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("select-track")
      .setPlaceholder(ctx.locale("cmd.search.select"))
      .addOptions(
        tracks.slice(0, 10).map((track: Track, index: number) => ({
          label: `${index + 1}. ${track.info.title.slice(0, 50)}${track.info.title.length > 50 ? "..." : ""}`,
          description: track.info.author.slice(0, 100),
          value: index.toString(),
        })),
      );

    const selectRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectMenu,
    );

    // Przyciski nawigacyjne
    const previousButton = new ButtonBuilder()
      .setCustomId("previous-page")
      .setLabel(ctx.locale("cmd.search.buttons.previous"))
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentPage === 0);

    const nextButton = new ButtonBuilder()
      .setCustomId("next-page")
      .setLabel(ctx.locale("cmd.search.buttons.next"))
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentPage === maxPages - 1);

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      previousButton,
      nextButton,
    );

    return {
      components: [resultsContainer, selectRow, buttonRow],
      flags: MessageFlags.IsComponentsV2,
    };
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

    let currentPage = 0;
    const maxPages = Math.ceil(response.tracks.length / TRACKS_PER_PAGE);


    const initialComponents = this.generatePageComponents(
      client,
      ctx,
      response.tracks,
      currentPage,
      maxPages,
    );
    const sentMessage = await ctx.sendMessage(initialComponents);


    const collector = (
      ctx.channel as TextChannel
    ).createMessageComponentCollector({
      filter: (f: any) => f.user.id === ctx.author?.id, 
      time: 120000, 
      idle: 60000, 
    });

    collector.on("collect", async (int: any) => {
      if (int.customId === "select-track") {

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
      } else if (int.customId === "previous-page") {

        if (currentPage > 0) {
          currentPage--;
          await int.deferUpdate(); 
          const newComponents = this.generatePageComponents(
            client,
            ctx,
            response.tracks,
            currentPage,
            maxPages,
          );
          await ctx.editMessage(newComponents); 
        } else {
          await int.deferUpdate(); 
        }
      } else if (int.customId === "next-page") {

        if (currentPage < maxPages - 1) {
          currentPage++;
          await int.deferUpdate(); 
          const newComponents = this.generatePageComponents(
            client,
            ctx,
            response.tracks,
            currentPage,
            maxPages,
          );
          await ctx.editMessage(newComponents); 
        } else {
          await int.deferUpdate(); 
        }
      }
      collector.resetTimer(); 
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
