import {
    ActionRowBuilder,
    type AutocompleteInteraction,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    Collection,
    CommandInteraction,
    EmbedBuilder,
    type GuildMember,
    InteractionType,
    PermissionFlagsBits,
    type TextChannel,
} from "discord.js";
import { T } from "../../structures/I18n";
import { Context, Event, type Lavamusic } from "../../structures/index";

export default class InteractionCreate extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "interactionCreate",
        });
    }

    public async run(interaction: CommandInteraction | AutocompleteInteraction): Promise<any> {
        if (interaction instanceof CommandInteraction && interaction.isCommand()) {
            const setup = await this.client.db.getSetup(interaction.guildId);
            const allowedCategories = ["filters", "music", "playlist"];
            const commandInSetup = this.client.commands.get(interaction.commandName);
            const locale = await this.client.db.getLanguage(interaction.guildId);

            if (
                setup &&
                interaction.channelId === setup.textId &&
                !(commandInSetup && allowedCategories.includes(commandInSetup.category))
            ) {
                return await interaction.reply({
                    content: T(locale, "event.interaction.setup_channel"),
                    ephemeral: true,
                });
            }

            const { commandName } = interaction;
            await this.client.db.get(interaction.guildId);

            const command = this.client.commands.get(commandName);
            if (!command) return;

            const ctx = new Context(interaction as any, interaction.options.data as any);
            ctx.setArgs(interaction.options.data as any);
            ctx.guildLocale = locale;
            const clientMember = interaction.guild.members.resolve(this.client.user);
            if (!(interaction.inGuild() && interaction.channel.permissionsFor(clientMember)?.has(PermissionFlagsBits.ViewChannel))) return;

            if (
                !(
                    clientMember.permissions.has(PermissionFlagsBits.ViewChannel) &&
                    clientMember.permissions.has(PermissionFlagsBits.SendMessages) &&
                    clientMember.permissions.has(PermissionFlagsBits.EmbedLinks) &&
                    clientMember.permissions.has(PermissionFlagsBits.ReadMessageHistory)
                )
            ) {
                return await (interaction.member as GuildMember)
                    .send({
                        content: T(locale, "event.interaction.no_send_message"),
                    })
                    .catch(() => {});
            }

            const logs = this.client.channels.cache.get(this.client.env.LOG_COMMANDS_ID);

            if (command.permissions) {
                if (command.permissions?.client) {
                    const missingClientPermissions = command.permissions.client.filter((perm) => !clientMember.permissions.has(perm));

                    if (missingClientPermissions.length > 0) {
                        return await interaction.reply({
                            content: T(locale, "event.interaction.no_permission", {
                                permissions: missingClientPermissions.map((perm) => `\`${perm}\``).join(", "),
                            }),
                            ephemeral: true,
                        });
                    }
                }

                if (command.permissions?.user && !(interaction.member as GuildMember).permissions.has(command.permissions.user)) {
                    await interaction.reply({
                        content: T(locale, "event.interaction.no_user_permission"),
                        ephemeral: true,
                    });
                    return;
                }

                if (command.permissions?.dev && this.client.env.OWNER_IDS) {
                    const isDev = this.client.env.OWNER_IDS.includes(interaction.user.id);
                    if (!isDev) return;
                }
            }
            if (command.vote && this.client.env.TOPGG) {
                const voted = await this.client.topGG.hasVoted(interaction.user.id);
                if (!voted) {
                    const voteBtn = new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setLabel(T(locale, "event.interaction.vote_button"))
                            .setURL(`https://top.gg/bot/${this.client.user.id}/vote`)
                            .setStyle(ButtonStyle.Link),
                    );

                    return await interaction.reply({
                        content: T(locale, "event.interaction.vote_message"),
                        components: [voteBtn],
                        ephemeral: true,
                    });
                }
            }
            if (command.player) {
                if (command.player.voice) {
                    if (!(interaction.member as GuildMember).voice.channel) {
                        return await interaction.reply({
                            content: T(locale, "event.interaction.no_voice_channel", { command: command.name }),
                        });
                    }

                    if (!clientMember.permissions.has(PermissionFlagsBits.Connect)) {
                        return await interaction.reply({
                            content: T(locale, "event.interaction.no_connect_permission", { command: command.name }),
                        });
                    }

                    if (!clientMember.permissions.has(PermissionFlagsBits.Speak)) {
                        return await interaction.reply({
                            content: T(locale, "event.interaction.no_speak_permission", { command: command.name }),
                        });
                    }

                    if (
                        (interaction.member as GuildMember).voice.channel.type === ChannelType.GuildStageVoice &&
                        !clientMember.permissions.has(PermissionFlagsBits.RequestToSpeak)
                    ) {
                        return await interaction.reply({
                            content: T(locale, "event.interaction.no_request_to_speak", { command: command.name }),
                        });
                    }

                    if (
                        clientMember.voice.channel &&
                        clientMember.voice.channelId !== (interaction.member as GuildMember).voice.channelId
                    ) {
                        return await interaction.reply({
                            content: T(locale, "event.interaction.different_voice_channel", {
                                channel: `<#${clientMember.voice.channelId}>`,
                                command: command.name,
                            }),
                        });
                    }
                }

                if (command.player.active) {
                    const queue = this.client.manager.getPlayer(interaction.guildId);
                    if (!queue.queue.current) {
                        return await interaction.reply({
                            content: T(locale, "event.interaction.no_music_playing"),
                        });
                    }
                }

                if (command.player.dj) {
                    const dj = await this.client.db.getDj(interaction.guildId);
                    if (dj?.mode) {
                        const djRole = await this.client.db.getRoles(interaction.guildId);
                        if (!djRole) {
                            return await interaction.reply({
                                content: T(locale, "event.interaction.no_dj_role"),
                            });
                        }

                        const hasDJRole = (interaction.member as GuildMember).roles.cache.some((role) =>
                            djRole.map((r) => r.roleId).includes(role.id),
                        );
                        if (!(hasDJRole && !(interaction.member as GuildMember).permissions.has(PermissionFlagsBits.ManageGuild))) {
                            return await interaction.reply({
                                content: T(locale, "event.interaction.no_dj_permission"),
                                ephemeral: true,
                            });
                        }
                    }
                }
            }

            if (!this.client.cooldown.has(commandName)) {
                this.client.cooldown.set(commandName, new Collection());
            }

            const now = Date.now();
            const timestamps = this.client.cooldown.get(commandName)!;
            const cooldownAmount = (command.cooldown || 5) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;
                const timeLeft = (expirationTime - now) / 1000;
                if (now < expirationTime && timeLeft > 0.9) {
                    return await interaction.reply({
                        content: T(locale, "event.interaction.cooldown", {
                            time: timeLeft.toFixed(1),
                            command: commandName,
                        }),
                    });
                }
                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            } else {
                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            }

            try {
                await command.run(this.client, ctx, ctx.args);
                if (setup && interaction.channelId === setup.textId && allowedCategories.includes(command.category)) {
                    setTimeout(() => {
                        interaction.deleteReply().catch(() => {});
                    }, 5000);
                }
                if (logs) {
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: "Slash - Command Logs",
                            iconURL: this.client.user?.avatarURL({
                                size: 2048,
                            }),
                        })
                        .setColor(this.client.config.color.blue)
                        .setDescription(
                            `**\`${command.name}\`** | Used By **${interaction.user.tag} \`${interaction.user.id}\`** From **${interaction.guild.name} \`${interaction.guild.id}\`**`,
                        )
                        .setTimestamp();

                    await (logs as TextChannel).send({ embeds: [embed] });
                }
            } catch (error) {
                this.client.logger.error(error);
                await interaction.reply({
                    content: T(locale, "event.interaction.error", { error }),
                });
            }
        } else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
            const command = this.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
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
