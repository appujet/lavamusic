import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type VoiceChannel } from "discord.js";
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
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
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

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const embed = this.client.embed().setColor(this.client.color.main);
        let player = client.manager.getPlayer(ctx.guild!.id);
        const query = args.join(" ");
        const memberVoiceChannel = (ctx.member as any).voice.channel as VoiceChannel;

        if (!player)
            player = client.manager.createPlayer({
                guildId: ctx.guild!.id,
                voiceChannelId: memberVoiceChannel.id,
                textChannelId: ctx.channel.id,
                selfMute: false,
                selfDeaf: true,

                vcRegion: memberVoiceChannel.rtcRegion,
            });
        if (!player.connected) await player.connect();
        const response = (await player.search({ query: query }, ctx.author)) as SearchResult;
        if (!response || response.tracks?.length === 0) {
            return await ctx.sendMessage({
                embeds: [embed.setDescription(ctx.locale("cmd.search.errors.no_results")).setColor(this.client.color.red)],
            });
        }
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId("1").setLabel("1").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("2").setLabel("2").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("3").setLabel("3").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("4").setLabel("4").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("5").setLabel("5").setStyle(ButtonStyle.Primary),
        );
        if (response.loadType === "search" && response.tracks.length > 5) {
            const embeds = response.tracks.map(
                (track: Track, index: number) => `${index + 1}. [${track.info.title}](${track.info.uri}) - \`${track.info.author}\``,
            );
            await ctx.sendMessage({
                embeds: [embed.setDescription(embeds.join("\n"))],
                components: [row],
            });
        }
        const collector = ctx.channel.createMessageComponentCollector({
            filter: (f: any) => f.user.id === ctx.author.id,
            max: 1,
            time: 60000,
            idle: 60000 / 2,
        });
        collector.on("collect", async (int: any) => {
            const track = response.tracks[parseInt(int.customId) - 1];
            await int.deferUpdate();
            if (!track) return;
            player.queue.add(track);
            if (!player.playing) await player.play({ paused: false });
            await ctx.editMessage({
                embeds: [
                    embed.setDescription(
                        ctx.locale("cmd.search.messages.added_to_queue", {
                            title: track.info.title,
                            uri: track.info.uri,
                        }),
                    ),
                ],
                components: [],
            });
            return collector.stop();
        });
        collector.on("end", async () => {
            await ctx.editMessage({ components: [] });
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
 * https://discord.gg/ns8CTk9J3e
 */
