import { type ColorResolvable, EmbedBuilder, type Message, type TextChannel } from "discord.js";
import { LoadType } from "shoukaku";
import type { Song } from "../structures/Dispatcher.js";
import { T } from "../structures/I18n.js";
import type { Dispatcher, Lavamusic } from "../structures/index.js";
import { getButtons } from "./Buttons.js";

function neb(
    embed: EmbedBuilder,
    player: Dispatcher,
    client: Lavamusic,
    locale: string,
): EmbedBuilder {
    if (!player?.current?.info) return embed;
    const iconUrl =
        client.config.icons[player.current.info.sourceName] ||
        client.user.displayAvatarURL({ extension: "png" });
    const icon = player.current.info.artworkUrl || client.config.links.img;

    const description = T(locale, "player.setupStart.description", {
        title: player.current.info.title,
        uri: player.current.info.uri,
        author: player.current.info.author,
        length: client.utils.formatTime(player.current.info.length),
        requester: player.current.info.requester,
    });
    return embed
        .setAuthor({ name: T(locale, "player.setupStart.now_playing"), iconURL: iconUrl })
        .setDescription(description)
        .setImage(icon)
        .setColor(client.color.main);
}

async function setupStart(
    client: Lavamusic,
    query: string,
    player: Dispatcher,
    message: Message,
): Promise<void> {
    let m: Message;
    const embed = client.embed();
    const n = client.embed().setColor(client.color.main);
    const data = await client.db.getSetup(message.guild.id);
    const locale = await client.db.getLanguage(message.guildId);
    try {
        if (data)
            m = await message.channel.messages.fetch({ message: data.messageId, cache: true });
    } catch (error) {
        client.logger.error(error);
    }
    if (m) {
        try {
            const res = await client.queue.search(query);
            switch (res.loadType) {
                case LoadType.ERROR:
                    await message.channel
                        .send({
                            embeds: [
                                embed
                                    .setColor(client.color.red)
                                    .setDescription(T(locale, "player.setupStart.error_searching")),
                            ],
                        })
                        .then((msg) => setTimeout(() => msg.delete(), 5000));
                    break;
                case LoadType.EMPTY:
                    await message.channel
                        .send({
                            embeds: [
                                embed
                                    .setColor(client.color.red)
                                    .setDescription(T(locale, "player.setupStart.no_results")),
                            ],
                        })
                        .then((msg) => setTimeout(() => msg.delete(), 5000));
                    break;
                case LoadType.TRACK: {
                    const track = player.buildTrack(res.data, message.author);
                    if (player.queue.length > client.config.maxQueueSize) {
                        await message.channel
                            .send({
                                embeds: [
                                    embed
                                        .setColor(client.color.red)
                                        .setDescription(
                                            T(locale, "player.setupStart.queue_too_long", {
                                                maxQueueSize: client.config.maxQueueSize,
                                            }),
                                        ),
                                ],
                            })
                            .then((msg) => setTimeout(() => msg.delete(), 5000));
                        return;
                    }
                    player.queue.push(track);
                    await player.isPlaying();
                    await message.channel
                        .send({
                            embeds: [
                                embed.setColor(client.color.main).setDescription(
                                    T(locale, "player.setupStart.added_to_queue", {
                                        title: res.data.info.title,
                                        uri: res.data.info.uri,
                                    }),
                                ),
                            ],
                        })
                        .then((msg) => setTimeout(() => msg.delete(), 5000));
                    neb(n, player, client, locale);
                    await m.edit({ embeds: [n] }).catch(() => {});
                    break;
                }
                case LoadType.PLAYLIST:
                    if (res.data.tracks.length > client.config.maxPlaylistSize) {
                        await message.channel
                            .send({
                                embeds: [
                                    embed.setColor(client.color.red).setDescription(
                                        T(locale, "player.setupStart.playlist_too_long", {
                                            maxPlaylistSize: client.config.maxPlaylistSize,
                                        }),
                                    ),
                                ],
                            })
                            .then((msg) => setTimeout(() => msg.delete(), 5000));
                        return;
                    }
                    for (const track of res.data.tracks) {
                        const pl = player.buildTrack(track, message.author);
                        if (player.queue.length > client.config.maxQueueSize) {
                            await message.channel
                                .send({
                                    embeds: [
                                        embed.setColor(client.color.red).setDescription(
                                            T(locale, "player.setupStart.queue_too_long", {
                                                maxQueueSize: client.config.maxQueueSize,
                                            }),
                                        ),
                                    ],
                                })
                                .then((msg) => setTimeout(() => msg.delete(), 5000));
                            return;
                        }
                        player.queue.push(pl);
                    }
                    await player.isPlaying();
                    await message.channel
                        .send({
                            embeds: [
                                embed
                                    .setColor(client.color.main)
                                    .setDescription(
                                        T(locale, "player.setupStart.added_playlist_to_queue", {
                                            length: res.data.tracks.length,
                                        }),
                                    ),
                            ],
                        })
                        .then((msg) => setTimeout(() => msg.delete(), 5000));
                    neb(n, player, client, locale);
                    await m.edit({ embeds: [n] }).catch(() => {});
                    break;
                case LoadType.SEARCH: {
                    const track = player.buildTrack(res.data[0], message.author);
                    if (player.queue.length > client.config.maxQueueSize) {
                        await message.channel
                            .send({
                                embeds: [
                                    embed
                                        .setColor(client.color.red)
                                        .setDescription(
                                            T(locale, "player.setupStart.queue_too_long", {
                                                maxQueueSize: client.config.maxQueueSize,
                                            }),
                                        ),
                                ],
                            })
                            .then((msg) => setTimeout(() => msg.delete(), 5000));
                        return;
                    }
                    player.queue.push(track);
                    await player.isPlaying();
                    await message.channel
                        .send({
                            embeds: [
                                embed.setColor(client.color.main).setDescription(
                                    T(locale, "player.setupStart.added_to_queue", {
                                        title: res.data[0].info.title,
                                        uri: res.data[0].info.uri,
                                    }),
                                ),
                            ],
                        })
                        .then((msg) => setTimeout(() => msg.delete(), 5000));
                    neb(n, player, client, locale);
                    await m.edit({ embeds: [n] }).catch(() => {});
                    break;
                }
            }
        } catch (error) {
            client.logger.error(error);
        }
    }
}

async function trackStart(
    msgId: any,
    channel: TextChannel,
    player: Dispatcher,
    track: Song,
    client: Lavamusic,
    locale: string,
): Promise<void> {
    const icon = player.current ? player.current.info.artworkUrl : client.config.links.img;
    let m: Message;

    try {
        m = await channel.messages.fetch({ message: msgId, cache: true });
    } catch (error) {
        client.logger.error(error);
    }

    const iconUrl =
        client.config.icons[player.current.info.sourceName] ||
        client.user.displayAvatarURL({ extension: "png" });
    const description = T(locale, "player.setupStart.description", {
        title: track.info.title,
        uri: track.info.uri,
        author: track.info.author,
        length: client.utils.formatTime(track.info.length),
        requester: track.info.requester,
    });

    const embed = client
        .embed()
        .setAuthor({ name: T(locale, "player.setupStart.now_playing"), iconURL: iconUrl })
        .setColor(client.color.main)
        .setDescription(description)
        .setImage(icon);

    if (m) {
        await m
            .edit({
                embeds: [embed],
                components: getButtons(player, client).map((b) => {
                    b.components.forEach((c) => c.setDisabled(!player?.current));
                    return b;
                }),
            })
            .catch(() => {});
    } else {
        await channel
            .send({
                embeds: [embed],
                components: getButtons(player, client).map((b) => {
                    b.components.forEach((c) => c.setDisabled(!player?.current));
                    return b;
                }),
            })
            .then((msg) => {
                client.db.setSetup(msg.guild.id, msg.id, msg.channel.id);
            })
            .catch(() => {});
    }
}

async function updateSetup(client: Lavamusic, guild: any, locale: string): Promise<void> {
    const setup = await client.db.getSetup(guild.id);
    let m: Message;
    if (setup?.textId) {
        const textChannel = guild.channels.cache.get(setup.textId) as TextChannel;
        if (!textChannel) return;
        try {
            m = await textChannel.messages.fetch({ message: setup.messageId, cache: true });
        } catch (error) {
            client.logger.error(error);
        }
    }
    if (m) {
        const player = client.queue.get(guild.id);
        if (player?.current) {
            const iconUrl =
                client.config.icons[player.current.info.sourceName] ||
                client.user.displayAvatarURL({ extension: "png" });
            const description = T(locale, "player.setupStart.description", {
                title: player.current.info.title,
                uri: player.current.info.uri,
                author: player.current.info.author,
                length: client.utils.formatTime(player.current.info.length),
                requester: player.current.info.requester,
            });

            const embed = client
                .embed()
                .setAuthor({ name: T(locale, "player.setupStart.now_playing"), iconURL: iconUrl })
                .setColor(client.color.main)
                .setDescription(description)
                .setImage(player.current.info.artworkUrl);
            await m
                .edit({
                    embeds: [embed],
                    components: getButtons(player, client).map((b) => {
                        b.components.forEach((c) => c.setDisabled(!player?.current));
                        return b;
                    }),
                })
                .catch(() => {});
        } else {
            const embed = client
                .embed()
                .setColor(client.color.main)
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL({ extension: "png" }),
                })
                .setDescription(T(locale, "player.setupStart.nothing_playing"))
                .setImage(client.config.links.img);
            await m
                .edit({
                    embeds: [embed],
                    components: getButtons(player, client).map((b) => {
                        b.components.forEach((c) => c.setDisabled(true));
                        return b;
                    }),
                })
                .catch(() => {});
        }
    }
}

async function buttonReply(int: any, args: string, color: ColorResolvable): Promise<void> {
    const embed = new EmbedBuilder();
    let m: Message;
    if (int.replied) {
        m = await int
            .editReply({ embeds: [embed.setColor(color).setDescription(args)] })
            .catch(() => {});
    } else {
        m = await int
            .followUp({ embeds: [embed.setColor(color).setDescription(args)] })
            .catch(() => {});
    }
    setTimeout(async () => {
        if (int && !int.ephemeral) {
            await m.delete().catch(() => {});
        }
    }, 2000);
}

async function oops(channel: TextChannel, args: string): Promise<void> {
    try {
        const embed1 = new EmbedBuilder().setColor("Red").setDescription(`${args}`);
        const m = await channel.send({
            embeds: [embed1],
        });
        setTimeout(async () => await m.delete().catch(() => {}), 12000);
    } catch (e) {
        return console.error(e);
    }
}
export { setupStart, trackStart, buttonReply, updateSetup, oops };

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
