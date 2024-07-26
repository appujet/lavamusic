import type { Message } from "discord.js";
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

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
    public async run(interaction: any): Promise<void> {
        if (!interaction.replied) await interaction.deferReply().catch(() => {});
        if (!interaction.member.voice.channel) {
            return await buttonReply(interaction, "You are not connected to a voice channel to use this button.", this.client.color.red);
        }
        const clientMember = interaction.guild.members.cache.get(this.client.user.id);
        if (clientMember.voice.channel && clientMember.voice.channelId !== interaction.member.voice.channelId) {
            return await buttonReply(
                interaction,
                `You are not connected to ${clientMember.voice.channel} to use these buttons.`,
                this.client.color.red,
            );
        }
        const player = this.client.queue.get(interaction.guildId);
        if (!player) return await buttonReply(interaction, "There is no music playing in this server.", this.client.color.red);
        if (!player.queue) return await buttonReply(interaction, "There is no music playing in this server.", this.client.color.red);
        if (!player.current) return await buttonReply(interaction, "There is no music playing in this server.", this.client.color.red);
        const data = await this.client.db.getSetup(interaction.guildId);
        const { title, uri, length, artworkUrl, sourceName, isStream, requester } = player.current.info;
        let message: Message;
        try {
            message = await interaction.channel.messages.fetch(data.messageId, { cache: true });
        } catch (_e) {
            /* empty */
        }

        const iconUrl = this.client.config.icons[sourceName] || this.client.user.displayAvatarURL({ extension: "png" });
        const embed = this.client
            .embed()
            .setAuthor({ name: "Now Playing", iconURL: iconUrl })
            .setColor(this.client.color.main)
            .setDescription(`[${title}](${uri}) - ${isStream ? "LIVE" : this.client.utils.formatTime(length)} - Requested by ${requester}`)
            .setImage(artworkUrl || this.client.user.displayAvatarURL({ extension: "png" }));

        if (!interaction.isButton()) return;
        if (!(await checkDj(this.client, interaction))) {
            return await buttonReply(interaction, "You need to have the DJ role to use this command.", this.client.color.red);
        }
        if (message) {
            const handleVolumeChange = async (change: number) => {
                const vol = player.player.volume + change;
                player.player.setGlobalVolume(vol);
                await buttonReply(interaction, `Volume set to ${vol}%`, this.client.color.main);
                await message.edit({
                    embeds: [embed.setFooter({ text: `Volume: ${vol}%`, iconURL: interaction.member.displayAvatarURL({}) })],
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
                    const name = player.player.paused ? "Resumed" : "Paused";
                    player.pause();
                    await buttonReply(interaction, `${name} the music.`, this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `${name} by ${interaction.member.displayName}`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                        components: getButtons(player, this.client),
                    });
                    break;
                }
                case "SKIP_BUT":
                    if (!player.queue.length) {
                        return await buttonReply(interaction, "There is no music to skip.", this.client.color.main);
                    }
                    player.skip();
                    await buttonReply(interaction, "Skipped the music.", this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `Skipped by ${interaction.member.displayName}`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                case "STOP_BUT":
                    player.stop();
                    await buttonReply(interaction, "Stopped the music.", this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed
                                .setFooter({
                                    text: `Stopped by ${interaction.member.displayName}`,
                                    iconURL: interaction.member.displayAvatarURL({}),
                                })
                                .setDescription("Nothing playing right now")
                                .setImage(this.client.config.links.img)
                                .setAuthor({
                                    name: this.client.user.username,
                                    iconURL: this.client.user.displayAvatarURL({ extension: "png" }),
                                }),
                        ],
                    });
                    break;
                case "LOOP_BUT": {
                    const loopOptions: Array<"off" | "queue" | "repeat"> = ["off", "queue", "repeat"];
                    const newLoop = loopOptions[(loopOptions.indexOf(player.loop) + 1) % loopOptions.length];
                    player.setLoop(newLoop);
                    await buttonReply(interaction, `Loop set to ${player.loop}.`, this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `Loop set to ${player.loop} by ${interaction.member.displayName}`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                }
                case "SHUFFLE_BUT":
                    player.setShuffle();
                    await buttonReply(interaction, "Shuffled the queue.", this.client.color.main);
                    break;
                case "PREV_BUT":
                    if (!player.previous) {
                        return await buttonReply(interaction, "There is no previous track.", this.client.color.main);
                    }
                    player.previousTrack();
                    await buttonReply(interaction, "Playing the previous track.", this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `Playing the previous track by ${interaction.member.displayName}`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                case "REWIND_BUT": {
                    const time = player.player.position - 10000;
                    if (time < 0) {
                        return await buttonReply(
                            interaction,
                            "You cannot rewind the music more than the length of the song.",
                            this.client.color.main,
                        );
                    }
                    player.seek(time);
                    await buttonReply(interaction, "Rewinded the music.", this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `Rewinded by ${interaction.member.displayName}`,
                                iconURL: interaction.member.displayAvatarURL({}),
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
                            "You cannot forward the music more than the length of the song.",
                            this.client.color.main,
                        );
                    }
                    player.seek(time);
                    await buttonReply(interaction, "Forwarded the music.", this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `Forwarded by ${interaction.member.displayName}`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                }
                default:
                    await buttonReply(interaction, "This button is not available.", this.client.color.main);
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
