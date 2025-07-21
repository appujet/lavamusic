import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  type TextChannel,
  type VoiceChannel,
  TextDisplayBuilder,
  SectionBuilder,
  MessageFlags,
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
    const embed = this.client.embed().setColor(this.client.color.main);
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
      return await ctx.sendMessage({
        embeds: [
          embed
            .setDescription(ctx.locale("cmd.search.errors.no_results"))
            .setColor(this.client.color.red),
        ],
      });
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("select-track")
      .setPlaceholder(ctx.locale("cmd.search.select"))
      .addOptions(
        response.tracks.slice(0, 10).map((track: Track, index: number) => ({
          label: `${index + 1}. ${track.info.title}`,
          description: track.info.author,
          value: index.toString(),
        })),
      );

    const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectMenu,
    );

    
    const displayComponents: SectionBuilder[] = [];

    
    if (response.tracks.length > 0) {
      displayComponents.push(
        new SectionBuilder()
          .addTextDisplayComponents(
            textDisplay => textDisplay
              .setContent(`**${ctx.locale("cmd.search.messages.results_found", { count: Math.min(response.tracks.length, 10) })}**`)
          )
      );
    }

    
    response.tracks.slice(0, 10).forEach((track: Track, index: number) => {
      displayComponents.push(
        new SectionBuilder()
          .addTextDisplayComponents(
            textDisplay => textDisplay
              .setContent(`${index + 1}. **[${track.info.title}](${track.info.uri})**\n*${track.info.author}*`)
          )
      );
    });

    
    const sentMessage = await ctx.sendMessage({
      components: [...displayComponents, actionRow],
      flags: MessageFlags.IsComponentsV2,
    });

    const collector = (
      ctx.channel as TextChannel
    ).createMessageComponentCollector({
      filter: (f: any) => f.user.id === ctx.author?.id && f.customId === 'select-track', 
      max: 1,
      time: 60000,
      idle: 60000 / 2,
    });

    collector.on("collect", async (int: any) => {
      const track = response.tracks[Number.parseInt(int.values[0])];
      await int.deferUpdate(); 

      if (!track) {
        return await int.followUp({ 
          embeds: [
            embed
              .setDescription(ctx.locale("cmd.search.errors.invalid_selection"))
              .setColor(this.client.color.red),
          ],
          ephemeral: true, 
        });
      }

      player.queue.add(track);
      if (!player.playing && player.queue.tracks.length > 0)
        await player.play({ paused: false });

      await ctx.editMessage({ 
        components: [
            new SectionBuilder() 
                .addTextDisplayComponents(
                    textDisplay => textDisplay
                        .setContent(
                            ctx.locale("cmd.search.messages.added_to_queue", {
                                title: track.info.title,
                                uri: track.info.uri,
                            }),
                        ),
                )
        ],
        flags: MessageFlags.IsComponentsV2,
      });
      return collector.stop();
    });

    collector.on("end", async (_collected, reason) => {
      if (reason === 'time' || reason === 'idle') {
        try {
            await ctx.editMessage({ components: [], embeds: [
                embed.setDescription(ctx.locale("cmd.search.messages.selection_timed_out")).setColor(this.client.color.red)
            ]});
        } catch (error) {
            console.error("Failed to edit message at collector end:", error);
        }
      }
    });
  }
}
