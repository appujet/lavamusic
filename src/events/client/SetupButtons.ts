import type { Message } from "discord.js";
import { T } from "../../structures/I18n.js";
import { Event, type Lavamusic } from "../../structures/index.js";
import { getButtons } from "../../utils/Buttons.js";
import { buttonReply } from "../../utils/SetupSystem.js";
import { checkDj } from "../player/TrackStart.js";

export default class SetupButtons extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "setupButtons",
        });
    }

    public async run(interaction: any): Promise<void> {
        const locale = await this.client.db.getLanguage(interaction.guildId);

        if (!interaction.replied)
            await interaction.deferReply().catch(() => {});
        if (!interaction.member.voice.channel) {
            return await buttonReply(
                interaction,
                T(locale, "event.setupButton.no_voice_channel_button"),
                this.client.color.red,
            );
        }
        const clientMember = interaction.guild.members.cache.get(
            this.client.user.id,
        );
        if (
            clientMember.voice.channel &&
            clientMember.voice.channelId !== interaction.member.voice.channelId
        ) {
            return await buttonReply(
                interaction,
                T(locale, "event.setupButton.different_voice_channel_button", {
                    channel: clientMember.voice.channel,
                }),
                this.client.color.red,
            );
        }
        const player = this.client.queue.get(interaction.guildId);
        if (!player)
            return await buttonReply(
                interaction,
                T(locale, "event.setupButton.no_music_playing"),
                this.client.color.red,
            );
        if (!player.queue)
            return await buttonReply(
                interaction,
                T(locale, "event.setupButton.no_music_playing"),
                this.client.color.red,
            );
        if (!player.current)
            return await buttonReply(
                interaction,
                T(locale, "event.setupButton.no_music_playing"),
                this.client.color.red,
            );
        const data = await this.client.db.getSetup(interaction.guildId);
        const {
            title,
            uri,
            length,
            artworkUrl,
            sourceName,
            isStream,
            requester,
        } = player.current.info;
        let message: Message;
        try {
            message = await interaction.channel.messages.fetch(data.messageId, {
                cache: true,
            });
        } catch (_e) {
            /* empty */
        }

        const iconUrl =
            this.client.config.icons[sourceName] ||
            this.client.user.displayAvatarURL({ extension: "png" });
        const embed = this.client
            .embed()
            .setAuthor({
                name: T(locale, "event.setupButton.now_playing"),
                iconURL: iconUrl,
            })
            .setColor(this.client.color.main)
            .setDescription(
                `[${title}](${uri}) - ${isStream ? T(locale, "event.setupButton.live") : this.client.utils.formatTime(length)} - ${T(locale, "event.setupButton.requested_by", { requester })}`,
            )
            .setImage(
                artworkUrl ||
                    this.client.user.displayAvatarURL({ extension: "png" }),
            );

        if (!interaction.isButton()) return;
        if (!(await checkDj(this.client, interaction))) {
            return await buttonReply(
                interaction,
                T(locale, "event.setupButton.no_dj_permission"),
                this.client.color.red,
            );
        }
        if (message) {
            const handleVolumeChange = async (change: number) => {
                const vol = player.player.volume + change;
                player.player.setGlobalVolume(vol);
                await buttonReply(
                    interaction,
                    T(locale, "event.setupButton.volume_set", { vol }),
                    this.client.color.main,
                );
                await message.edit({
                    embeds: [
                        embed.setFooter({
                            text: T(locale, "event.setupButton.volume_footer", {
                                vol,
                                displayName: interaction.member.displayName,
                            }),
                            iconURL: interaction.member.displayAvatarURL({}),
                        }),
                    ],
                });
            };
            switch (interaction.customId) {
                case "LOW_VOL_BUT":
                    await handleVolumeChange(-10);
                    break;
                case "HIGH_VOL_BUT":
                    await handleVolumeChange(10);
                    break;
                case "PAUSE_BUT": {
                    const name = player.player.paused
                        ? T(locale, "event.setupButton.resumed")
                        : T(locale, "event.setupButton.paused");
                    player.pause();
                    await buttonReply(
                        interaction,
                        T(locale, "event.setupButton.pause_resume", { name }),
                        this.client.color.main,
                    );
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: T(
                                    locale,
                                    "event.setupButton.pause_resume_footer",
                                    {
                                        name,
                                        displayName:
                                            interaction.member.displayName,
                                    },
                                ),
                                iconURL: interaction.member.displayAvatarURL(
                                    {},
                                ),
                            }),
                        ],
                        components: getButtons(player, this.client),
                    });
                    break;
                }
                case "SKIP_BUT":
                    if (!player.queue.length) {
                        return await buttonReply(
                            interaction,
                            T(locale, "event.setupButton.no_music_to_skip"),
                            this.client.color.main,
                        );
                    }
                    player.skip();
                    await buttonReply(
                        interaction,
                        T(locale, "event.setupButton.skipped"),
                        this.client.color.main,
                    );
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: T(
                                    locale,
                                    "event.setupButton.skipped_footer",
                                    {
                                        displayName:
                                            interaction.member.displayName,
                                    },
                                ),
                                iconURL: interaction.member.displayAvatarURL(
                                    {},
                                ),
                            }),
                        ],
                    });
                    break;
                case "STOP_BUT":
                    player.stop();
                    await buttonReply(
                        interaction,
                        T(locale, "event.setupButton.stopped"),
                        this.client.color.main,
                    );
                    await message.edit({
                        embeds: [
                            embed
                                .setFooter({
                                    text: T(
                                        locale,
                                        "event.setupButton.stopped_footer",
                                        {
                                            displayName:
                                                interaction.member.displayName,
                                        },
                                    ),
                                    iconURL:
                                        interaction.member.displayAvatarURL({}),
                                })
                                .setDescription(
                                    T(
                                        locale,
                                        "event.setupButton.nothing_playing",
                                    ),
                                )
                                .setImage(this.client.config.links.img)
                                .setAuthor({
                                    name: this.client.user.username,
                                    iconURL: this.client.user.displayAvatarURL({
                                        extension: "png",
                                    }),
                                }),
                        ],
                    });
                    break;
                case "LOOP_BUT": {
                    const loopOptions: Array<"off" | "queue" | "repeat"> = [
                        "off",
                        "queue",
                        "repeat",
                    ];
                    const newLoop =
                        loopOptions[
                            (loopOptions.indexOf(player.loop) + 1) %
                                loopOptions.length
                        ];
                    player.setLoop(newLoop);
                    await buttonReply(
                        interaction,
                        T(locale, "event.setupButton.loop_set", {
                            loop: newLoop,
                        }),
                        this.client.color.main,
                    );
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: T(
                                    locale,
                                    "event.setupButton.loop_footer",
                                    {
                                        loop: newLoop,
                                        displayName:
                                            interaction.member.displayName,
                                    },
                                ),
                                iconURL: interaction.member.displayAvatarURL(
                                    {},
                                ),
                            }),
                        ],
                    });
                    break;
                }
                case "SHUFFLE_BUT":
                    player.setShuffle();
                    await buttonReply(
                        interaction,
                        T(locale, "event.setupButton.shuffled"),
                        this.client.color.main,
                    );
                    break;
                case "PREV_BUT":
                    if (!player.previous) {
                        return await buttonReply(
                            interaction,
                            T(locale, "event.setupButton.no_previous_track"),
                            this.client.color.main,
                        );
                    }
                    player.previousTrack();
                    await buttonReply(
                        interaction,
                        T(locale, "event.setupButton.playing_previous"),
                        this.client.color.main,
                    );
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: T(
                                    locale,
                                    "event.setupButton.previous_footer",
                                    {
                                        displayName:
                                            interaction.member.displayName,
                                    },
                                ),
                                iconURL: interaction.member.displayAvatarURL(
                                    {},
                                ),
                            }),
                        ],
                    });
                    break;
                case "REWIND_BUT": {
                    const time = player.player.position - 10000;
                    if (time < 0) {
                        return await buttonReply(
                            interaction,
                            T(locale, "event.setupButton.rewind_limit"),
                            this.client.color.main,
                        );
                    }
                    player.seek(time);
                    await buttonReply(
                        interaction,
                        T(locale, "event.setupButton.rewinded"),
                        this.client.color.main,
                    );
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: T(
                                    locale,
                                    "event.setupButton.rewind_footer",
                                    {
                                        displayName:
                                            interaction.member.displayName,
                                    },
                                ),
                                iconURL: interaction.member.displayAvatarURL(
                                    {},
                                ),
                            }),
                        ],
                    });
                    break;
                }
                case "FORWARD_BUT": {
                    const time = player.player.position + 10000;
                    if (time > player.current.info.length) {
                        return await buttonReply(
                            interaction,
                            T(locale, "event.setupButton.forward_limit"),
                            this.client.color.main,
                        );
                    }
                    player.seek(time);
                    await buttonReply(
                        interaction,
                        T(locale, "event.setupButton.forwarded"),
                        this.client.color.main,
                    );
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: T(
                                    locale,
                                    "event.setupButton.forward_footer",
                                    {
                                        displayName:
                                            interaction.member.displayName,
                                    },
                                ),
                                iconURL: interaction.member.displayAvatarURL(
                                    {},
                                ),
                            }),
                        ],
                    });
                    break;
                }
                default:
                    await buttonReply(
                        interaction,
                        T(locale, "event.setupButton.button_not_available"),
                        this.client.color.main,
                    );
                    break;
            }
        }
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
