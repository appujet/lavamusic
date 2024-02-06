/* eslint-disable no-case-declarations */
import { ColorResolvable, EmbedBuilder, Message, TextChannel } from 'discord.js';
import { LoadType } from 'shoukaku';

import { getButtons } from './Buttons.js';
import { Song } from '../structures/Dispatcher.js';
import { Dispatcher, Lavamusic } from '../structures/index.js';

function neb(embed: EmbedBuilder, player: Dispatcher, client: Lavamusic): EmbedBuilder {
    let iconUrl = client.config.icons[player.current.info.sourceName];
    if (!iconUrl) iconUrl = client.user.displayAvatarURL({ extension: 'png' });

    let icon = player.current ? player.current.info.artworkUrl : client.config.links.img;
    return embed
        .setAuthor({ name: 'Now Playing', iconURL: iconUrl })
        .setDescription(
            `[${player.current.info.title}](${player.current.info.uri}) by ${
                player.current.info.author
            } • \`[${client.utils.formatTime(player.current.info.length)}]\` - Requested by ${
                player.current.info.requester
            }`
        )
        .setImage(icon)
        .setColor(client.color.main);
}

async function setupStart(
    client: Lavamusic,
    query: string,
    player: Dispatcher,
    message: Message
): Promise<void> {
    let m: Message;
    const embed = client.embed();
    let n = client.embed().setColor(client.color.main);

    const data = client.db.getSetup(message.guild.id);
    try {
        if (data)
            m = await message.channel.messages.fetch({ message: data.messageId, cache: true });
    } catch (error) {
        client.logger.error(error);
    }
    if (m) {
        try {
            let res = await client.queue.search(query);
            switch (res.loadType) {
                case LoadType.ERROR:
                    await message.channel
                        .send({
                            embeds: [
                                embed
                                    .setColor(client.color.red)
                                    .setDescription('There was an error while searching.'),
                            ],
                        })
                        .then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    break;
                case LoadType.EMPTY:
                    await message.channel
                        .send({
                            embeds: [
                                embed
                                    .setColor(client.color.red)
                                    .setDescription('There were no results found.'),
                            ],
                        })
                        .then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    break;
                case LoadType.TRACK:
                    const track = player.buildTrack(res.data, message.author);

                    if (player.queue.length > client.config.maxQueueSize) {
                        await message.channel
                            .send({
                                embeds: [
                                    embed
                                        .setColor(client.color.red)
                                        .setDescription(
                                            `The queue is too long. The maximum length is ${client.config.maxQueueSize} songs.`
                                        ),
                                ],
                            })
                            .then(msg => {
                                setTimeout(() => {
                                    msg.delete();
                                }, 5000);
                            });
                        return;
                    }
                    player.queue.push(track);
                    await player.isPlaying();
                    await message.channel
                        .send({
                            embeds: [
                                embed
                                    .setColor(client.color.main)
                                    .setDescription(
                                        `Added [${res.data.info.title}](${res.data.info.uri}) to the queue.`
                                    ),
                            ],
                        })
                        .then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    neb(n, player, client);
                    if (m) await m.edit({ embeds: [n] }).catch(() => {});
                    break;
                case LoadType.PLAYLIST:
                    if (res.data.tracks.length > client.config.maxPlaylistSize) {
                        await message.channel
                            .send({
                                embeds: [
                                    embed
                                        .setColor(client.color.red)
                                        .setDescription(
                                            `The playlist is too long. The maximum length is ${client.config.maxPlaylistSize} songs.`
                                        ),
                                ],
                            })
                            .then(msg => {
                                setTimeout(() => {
                                    msg.delete();
                                }, 5000);
                            });
                        return;
                    }
                    for (const track of res.data.tracks) {
                        const pl = player.buildTrack(track, message.author);
                        if (player.queue.length > client.config.maxQueueSize) {
                            await message.channel
                                .send({
                                    embeds: [
                                        embed
                                            .setColor(client.color.red)
                                            .setDescription(
                                                `The queue is too long. The maximum length is ${client.config.maxQueueSize} songs.`
                                            ),
                                    ],
                                })
                                .then(msg => {
                                    setTimeout(() => {
                                        msg.delete();
                                    }, 5000);
                                });
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
                                        `Added [${res.data.tracks.length}](${res.data.tracks[0].info.uri}) to the queue.`
                                    ),
                            ],
                        })
                        .then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    neb(n, player, client);
                    if (m) await m.edit({ embeds: [n] }).catch(() => {});
                    break;
                case LoadType.SEARCH:
                    const track2 = player.buildTrack(res.data[0], message.author);
                    if (player.queue.length > client.config.maxQueueSize) {
                        await message.channel
                            .send({
                                embeds: [
                                    embed
                                        .setColor(client.color.red)
                                        .setDescription(
                                            `The queue is too long. The maximum length is ${client.config.maxQueueSize} songs.`
                                        ),
                                ],
                            })
                            .then(msg => {
                                setTimeout(() => {
                                    msg.delete();
                                }, 5000);
                            });
                        return;
                    }
                    player.queue.push(track2);
                    await player.isPlaying();
                    await message.channel
                        .send({
                            embeds: [
                                embed
                                    .setColor(client.color.main)
                                    .setDescription(
                                        `Added [${res.data[0].info.title}](${res.data[0].info.uri}) to the queue.`
                                    ),
                            ],
                        })
                        .then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        });
                    neb(n, player, client);
                    if (m) await m.edit({ embeds: [n] }).catch(() => {});
                    break;
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
    client: Lavamusic
): Promise<void> {
    let icon = player.current ? player.current.info.artworkUrl : client.config.links.img;
    let m: Message;
    try {
        m = await channel.messages.fetch({ message: msgId, cache: true });
    } catch (error) {
        client.logger.error(error);
    }
    if (m) {
        let iconUrl = client.config.icons[player.current.info.sourceName];
        if (!iconUrl) iconUrl = client.user.displayAvatarURL({ extension: 'png' });
        const embed = client
            .embed()
            .setAuthor({ name: `Now Playing`, iconURL: iconUrl })
            .setColor(client.color.main)
            .setDescription(
                `[${track.info.title}](${track.info.uri}) - \`[${client.utils.formatTime(
                    track.info.length
                )}]\` - Requested by ${track.info.requester}`
            )
            .setImage(icon);
        await m
            .edit({
                embeds: [embed],
                components: getButtons().map(b => {
                    b.components.forEach(c => {
                        c.setDisabled(player && player.current ? false : true);
                    });
                    return b;
                }),
            })
            .catch(() => {});
    } else {
        let iconUrl = client.config.icons[player.current.info.sourceName];
        if (!iconUrl) iconUrl = client.user.displayAvatarURL({ extension: 'png' });
        const embed = client
            .embed()
            .setColor(client.color.main)
            .setAuthor({ name: `Now Playing`, iconURL: iconUrl })
            .setDescription(
                `[${track.info.title}](${track.info.uri}) - \`[${client.utils.formatTime(
                    track.info.length
                )}]\` - Requested by ${track.info.requester}`
            )
            .setImage(icon);
        await channel
            .send({
                embeds: [embed],
                components: getButtons().map(b => {
                    b.components.forEach(c => {
                        c.setDisabled(player && player.current ? false : true);
                    });
                    return b;
                }),
            })
            .then(msg => {
                client.db.setSetup(msg.guild.id, msg.id, msg.channel.id);
            })
            .catch(() => {});
    }
}

async function updateSetup(client: Lavamusic, guild: any): Promise<void> {
    let setup = client.db.getSetup(guild.id);
    let m: Message;
    if (setup && setup.textId) {
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
        if (player && player.current) {
            let iconUrl = client.config.icons[player.current.info.sourceName];
            if (!iconUrl) iconUrl = client.user.displayAvatarURL({ extension: 'png' });
            const embed = client
                .embed()
                .setAuthor({ name: `Now Playing`, iconURL: iconUrl })
                .setColor(client.color.main)
                .setDescription(
                    `[${player.current.info.title}](${
                        player.current.info.uri
                    }) - \`[${client.utils.formatTime(
                        player.current.info.length
                    )}]\` - Requested by ${player.current.info.requester}`
                )
                .setImage(player.current.info.artworkUrl);
            await m
                .edit({
                    embeds: [embed],
                    components: getButtons().map(b => {
                        b.components.forEach(c => {
                            c.setDisabled(player && player.current ? false : true);
                        });
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
                    iconURL: client.user.displayAvatarURL({ extension: 'png' }),
                })
                .setDescription(`Nothing playing right now`)
                .setImage(client.config.links.img);
            await m
                .edit({
                    embeds: [embed],
                    components: getButtons().map(b => {
                        b.components.forEach(c => {
                            c.setDisabled(true);
                        });
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
        let embed1 = new EmbedBuilder().setColor('Red').setDescription(`${args}`);

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
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
