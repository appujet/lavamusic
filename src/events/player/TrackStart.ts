import {
    ActionRowBuilder,
    ButtonBuilder,
    type ButtonInteraction,
    ButtonStyle,
    type ChannelSelectMenuInteraction,
    GuildMember,
    type MentionableSelectMenuInteraction,
    PermissionFlagsBits,
    type RoleSelectMenuInteraction,
    type StringSelectMenuInteraction,
    type TextChannel,
    type UserSelectMenuInteraction,
} from "discord.js";
import type { Player } from "shoukaku";
import type { Song } from "../../structures/Dispatcher.js";
import { T } from "../../structures/I18n.js";
import { type Dispatcher, Event, type Lavamusic } from "../../structures/index.js";
import { trackStart } from "../../utils/SetupSystem.js";

export default class TrackStart extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "trackStart",
        });
    }

    public async run(player: Player, track: Song, dispatcher: Dispatcher): Promise<void> {
        if (!track?.info) return;

        const guild = this.client.guilds.cache.get(player.guildId);
        if (!guild) return;

        const channel = guild.channels.cache.get(dispatcher.channelId) as TextChannel;
        if (!channel) return;

        this.client.utils.updateStatus(this.client, guild.id);

        const locale = await this.client.db.getLanguage(guild.id);

        const embed = this.client
            .embed()
            .setAuthor({
                name: T(locale, "player.trackStart.now_playing"),
                iconURL: this.client.config.icons[track.info.sourceName] ?? this.client.user.displayAvatarURL({ extension: "png" }),
            })
            .setColor(this.client.color.main)
            .setDescription(`**[${track.info.title}](${track.info.uri})**`)
            .setFooter({
                text: T(locale, "player.trackStart.requested_by", { user: track.info.requester.tag }),
                iconURL: track.info.requester.avatarURL({}),
            })
            .setThumbnail(track.info.artworkUrl)
            .addFields(
                {
                    name: T(locale, "player.trackStart.duration"),
                    value: track.info.isStream ? "LIVE" : this.client.utils.formatTime(track.info.length),
                    inline: true,
                },
                { name: T(locale, "player.trackStart.author"), value: track.info.author, inline: true },
            )
            .setTimestamp();

        const setup = await this.client.db.getSetup(guild.id);

        if (setup?.textId) {
            const textChannel = guild.channels.cache.get(setup.textId) as TextChannel;
            const id = setup.messageId;

            if (textChannel) {
                await trackStart(id, textChannel, dispatcher, track, this.client);
            }
        } else {
            const message = await channel.send({
                embeds: [embed],
                components: [createButtonRow(dispatcher)],
            });

            dispatcher.nowPlayingMessage = message;
            createCollector(message, dispatcher, track, embed, this.client, locale);
        }
    }
}

function createButtonRow(dispatcher: Dispatcher): ActionRowBuilder<ButtonBuilder> {
    const previousButton = new ButtonBuilder()

        .setCustomId("previous")
        .setEmoji("⏪")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!dispatcher.previous);

    const resumeButton = new ButtonBuilder()
        .setCustomId("resume")
        .setEmoji(dispatcher.paused ? "▶️" : "⏸️")
        .setStyle(dispatcher.paused ? ButtonStyle.Success : ButtonStyle.Secondary);

    const stopButton = new ButtonBuilder().setCustomId("stop").setEmoji("⏹️").setStyle(ButtonStyle.Danger);

    const skipButton = new ButtonBuilder().setCustomId("skip").setEmoji("⏩").setStyle(ButtonStyle.Secondary);

    const loopButton = new ButtonBuilder()
        .setCustomId("loop")
        .setEmoji(dispatcher.loop === "repeat" ? "🔂" : "🔁")
        .setStyle(dispatcher.loop !== "off" ? ButtonStyle.Success : ButtonStyle.Secondary);

    return new ActionRowBuilder<ButtonBuilder>().addComponents(resumeButton, previousButton, stopButton, skipButton, loopButton);
}

function createCollector(message: any, dispatcher: Dispatcher, _track: Song, embed: any, client: Lavamusic, locale: string): void {
    const collector = message.createMessageComponentCollector({
        filter: async (b: ButtonInteraction) => {
            if (b.member instanceof GuildMember) {
                const isSameVoiceChannel = b.guild.members.me?.voice.channelId === b.member.voice.channelId;
                if (isSameVoiceChannel) return true;
            }
            await b.reply({
                content: T(locale, "player.trackStart.not_connected_to_voice_channel", {
                    channel: b.guild.members.me?.voice.channelId ?? "None",
                }),
                ephemeral: true,
            });
            return false;
        },
    });

    collector.on("collect", async (interaction) => {
        if (!(await checkDj(client, interaction))) {
            await interaction.reply({
                content: T(locale, "player.trackStart.need_dj_role"),
                ephemeral: true,
            });
            return;
        }

        const editMessage = async (text: string): Promise<void> => {
            if (message) {
                await message.edit({
                    embeds: [embed.setFooter({ text, iconURL: interaction.user.avatarURL({}) })],
                    components: [createButtonRow(dispatcher)],
                });
            }
        };
        switch (interaction.customId) {
            case "previous":
                if (dispatcher.previous) {
                    await interaction.deferUpdate();
                    dispatcher.previousTrack();
                    await editMessage(T(locale, "player.trackStart.previous_by", { user: interaction.user.tag }));
                } else {
                    await interaction.reply({
                        content: T(locale, "player.trackStart.no_previous_song"),
                        ephemeral: true,
                    });
                }
                break;
            case "resume":
                dispatcher.pause();
                await interaction.deferUpdate();
                await editMessage(
                    dispatcher.paused
                        ? T(locale, "player.trackStart.paused_by", { user: interaction.user.tag })
                        : T(locale, "player.trackStart.resumed_by", { user: interaction.user.tag }),
                );
                break;
            case "stop":
                dispatcher.stop();
                await interaction.deferUpdate();
                break;
            case "skip":
                if (dispatcher.queue.length) {
                    await interaction.deferUpdate();
                    dispatcher.skip();
                    await editMessage(T(locale, "player.trackStart.skipped_by", { user: interaction.user.tag }));
                } else {
                    await interaction.reply({
                        content: T(locale, "player.trackStart.no_more_songs_in_queue"),
                        ephemeral: true,
                    });
                }
                break;
            case "loop":
                await interaction.deferUpdate();
                switch (dispatcher.loop) {
                    case "off":
                        dispatcher.loop = "repeat";
                        await editMessage(T(locale, "player.trackStart.looping_by", { user: interaction.user.tag }));
                        break;
                    case "repeat":
                        dispatcher.loop = "queue";
                        await editMessage(T(locale, "player.trackStart.looping_queue_by", { user: interaction.user.tag }));
                        break;
                    case "queue":
                        dispatcher.loop = "off";
                        await editMessage(T(locale, "player.trackStart.looping_off_by", { user: interaction.user.tag }));
                        break;
                }
                break;
        }
    });
}

export async function checkDj(
    client: Lavamusic,
    interaction:
        | ButtonInteraction<"cached">
        | StringSelectMenuInteraction<"cached">
        | UserSelectMenuInteraction<"cached">
        | RoleSelectMenuInteraction<"cached">
        | MentionableSelectMenuInteraction<"cached">
        | ChannelSelectMenuInteraction<"cached">,
): Promise<boolean> {
    const dj = await client.db.getDj(interaction.guildId);
    if (dj?.mode) {
        const djRole = await client.db.getRoles(interaction.guildId);
        if (!djRole) return false;
        const hasDjRole = interaction.member.roles.cache.some((role) => djRole.map((r) => r.roleId).includes(role.id));
        if (!(hasDjRole || interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))) {
            return false;
        }
    }
    return true;
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
