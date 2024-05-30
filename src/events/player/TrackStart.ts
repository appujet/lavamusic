import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuInteraction,
    GuildMember,
    MentionableSelectMenuInteraction,
    PermissionFlagsBits,
    RoleSelectMenuInteraction,
    StringSelectMenuInteraction,
    TextChannel,
    UserSelectMenuInteraction,
} from 'discord.js';
import { Player } from 'shoukaku';

import { Song } from '../../structures/Dispatcher.js';
import { Dispatcher, Event, Lavamusic } from '../../structures/index.js';
import { trackStart } from '../../utils/SetupSystem.js';

export default class TrackStart extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'trackStart',
        });
    }

    public async run(player: Player, track: Song, dispatcher: Dispatcher): Promise<void> {
        const guild = this.client.guilds.cache.get(player.guildId);
        if (!guild) return;

        const channel = guild.channels.cache.get(dispatcher.channelId) as TextChannel;
        if (!channel) return;

        this.client.utils.updateStatus(this.client, guild.id);

        const embed = this.client
            .embed()
            .setAuthor({
                name: 'Now Playing',
                iconURL:
                    this.client.config.icons[track.info.sourceName] ??
                    this.client.user.displayAvatarURL({ extension: 'png' }),
            })
            .setColor(this.client.color.main)
            .setDescription(`**[${track.info.title}](${track.info.uri})**`)
            .setFooter({
                text: `Requested by ${track.info.requester.tag}`,
                iconURL: track.info.requester.avatarURL({}),
            })
            .setThumbnail(track.info.artworkUrl)
            .addFields(
                {
                    name: 'Duration',
                    value: track.info.isStream
                        ? 'LIVE'
                        : this.client.utils.formatTime(track.info.length),
                    inline: true,
                },
                { name: 'Author', value: track.info.author, inline: true }
            )
            .setTimestamp();

        const setup = await this.client.db.getSetup(guild.id);
        if (setup && setup.textId) {
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
            createCollector(message, dispatcher, track, embed, this.client);
        }
    }
}

function createButtonRow(dispatcher: Dispatcher): ActionRowBuilder<ButtonBuilder> {
    const previousButton = new ButtonBuilder()
        .setCustomId('previous')
        .setEmoji('⏪')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!dispatcher.previous);

    const resumeButton = new ButtonBuilder()
        .setCustomId('resume')
        .setEmoji(dispatcher.paused ? '▶️' : '⏸️')
        .setStyle(dispatcher.paused ? ButtonStyle.Success : ButtonStyle.Secondary);

    const stopButton = new ButtonBuilder()
        .setCustomId('stop')
        .setEmoji('⏹️')
        .setStyle(ButtonStyle.Danger);

    const skipButton = new ButtonBuilder()
        .setCustomId('skip')
        .setEmoji('⏩')
        .setStyle(ButtonStyle.Secondary);

    const loopButton = new ButtonBuilder()
        .setCustomId('loop')
        .setEmoji(dispatcher.loop === 'repeat' ? '🔂' : '🔁')
        .setStyle(dispatcher.loop !== 'off' ? ButtonStyle.Success : ButtonStyle.Secondary);

    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        resumeButton,
        previousButton,
        stopButton,
        skipButton,
        loopButton
    );
}

function createCollector(
    message: any,
    dispatcher: Dispatcher,
    track: Song,
    embed: any,
    client: Lavamusic
): void {
    const collector = message.createMessageComponentCollector({
        filter: async (b: ButtonInteraction) => {
            if (b.member instanceof GuildMember) {
                const isSameVoiceChannel =
                    b.guild.members.me?.voice.channelId === b.member.voice.channelId;
                if (isSameVoiceChannel) return true;
            }
            await b.reply({
                content: `You are not connected to <#${b.guild.members.me?.voice.channelId ?? 'None'}> to use these buttons.`,
                ephemeral: true,
            });
            return false;
        },
    });

    collector.on('collect', async interaction => {
        if (!(await checkDj(client, interaction))) {
            await interaction.reply({
                content: `You need to have the DJ role to use this command.`,
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
            case 'previous':
                if (!dispatcher.previous) {
                    await interaction.reply({
                        content: `There is no previous song.`,
                        ephemeral: true,
                    });
                } else {
                    await interaction.deferUpdate();
                    dispatcher.previousTrack();
                    await editMessage(`Previous by ${interaction.user.tag}`);
                }
                break;
            case 'resume':
                if (dispatcher.pause) {
                    dispatcher.pause();
                    await interaction.deferUpdate();
                    await editMessage(`Resumed by ${interaction.user.tag}`);
                } else {
                    dispatcher.pause();
                    await interaction.deferUpdate();
                    await editMessage(`Paused by ${interaction.user.tag}`);
                }
                break;
            case 'stop':
                dispatcher.stop();
                if (message) {
                    await interaction.deferUpdate();
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `Stopped by ${interaction.user.tag}`,
                                iconURL: interaction.user.avatarURL({}),
                            }),
                        ],
                        components: [],
                    });
                }
                break;
            case 'skip':
                if (!dispatcher.queue.length) {
                    await interaction.reply({
                        content: `There is no more song in the queue.`,
                        ephemeral: true,
                    });
                } else {
                    await interaction.deferUpdate();
                    dispatcher.skip();
                    await editMessage(`Skipped by ${interaction.user.tag}`);
                }
                break;
            case 'loop':
                switch (dispatcher.loop) {
                    case 'off':
                        await interaction.deferUpdate();
                        dispatcher.loop = 'repeat';
                        await editMessage(`Looping by ${interaction.user.tag}`);
                        break;
                    case 'repeat':
                        await interaction.deferUpdate();
                        dispatcher.loop = 'queue';
                        await editMessage(`Looping Queue by ${interaction.user.tag}`);
                        break;
                    case 'queue':
                        await interaction.deferUpdate();
                        dispatcher.loop = 'off';
                        await editMessage(`Looping Off by ${interaction.user.tag}`);
                        break;
                }
                break;
        }
    });
}

export async function checkDj(
    client: Lavamusic,
    interaction:
        | ButtonInteraction<'cached'>
        | StringSelectMenuInteraction<'cached'>
        | UserSelectMenuInteraction<'cached'>
        | RoleSelectMenuInteraction<'cached'>
        | MentionableSelectMenuInteraction<'cached'>
        | ChannelSelectMenuInteraction<'cached'>
): Promise<boolean> {
    const dj = await client.db.getDj(interaction.guildId);
    if (dj?.mode) {
        const djRole = await client.db.getRoles(interaction.guildId);
        if (!djRole) return false;
        const hasDjRole = interaction.member.roles.cache.some(role =>
            djRole.map(r => r.roleId).includes(role.id)
        );
        if (!hasDjRole && !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
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
