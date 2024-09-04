import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    Collection,
    EmbedBuilder,
    type GuildMember,
    type Message,
    PermissionFlagsBits,
    type TextChannel,
} from "discord.js";
import { T } from "../../structures/I18n.js";
import { Context, Event, type Lavamusic } from "../../structures/index.js";

export default class MessageCreate extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "messageCreate",
        });
    }

    public async run(message: Message): Promise<any> {
        if (message.author.bot) return;

        const setup = await this.client.db.getSetup(message.guildId);
        if (setup && setup.textId === message.channelId) {
            return this.client.emit("setupSystem", message);
        }
        const locale = await this.client.db.getLanguage(message.guildId);

        const guild = await this.client.db.get(message.guildId);
        const mention = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
        if (mention.test(message.content)) {
            await message.reply({
                content: T(locale, "event.message.prefix_mention", {
                    prefix: guild.prefix,
                }),
            });
            return;
        }

        const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${escapeRegex(guild.prefix)})\\s*`);
        if (!prefixRegex.test(message.content)) return;

        const [matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
        const cmd = args.shift()?.toLowerCase();
        const command = this.client.commands.get(cmd) || this.client.commands.get(this.client.aliases.get(cmd) as string);
        if (!command) return;

        const ctx = new Context(message, args);
        ctx.setArgs(args);
        ctx.guildLocale = locale;

        const clientMember = message.guild.members.resolve(this.client.user);
        if (!(message.inGuild() && message.channel.permissionsFor(clientMember)?.has(PermissionFlagsBits.ViewChannel))) return;

        if (
            !(
                clientMember.permissions.has(PermissionFlagsBits.ViewChannel) &&
                clientMember.permissions.has(PermissionFlagsBits.SendMessages) &&
                clientMember.permissions.has(PermissionFlagsBits.EmbedLinks) &&
                clientMember.permissions.has(PermissionFlagsBits.ReadMessageHistory)
            )
        ) {
            return await message.author
                .send({
                    content: T(locale, "event.message.no_send_message", {
                        guild: message.guild.name,
                        channel: `<#${message.channelId}>`,
                    }),
                })
                .catch(() => {});
        }

        if (command.permissions) {
            if (command.permissions?.client) {
                const missingClientPermissions = command.permissions.client.filter((perm) => !clientMember.permissions.has(perm));

                if (missingClientPermissions.length > 0) {
                    return await message.reply({
                        content: T(locale, "event.message.no_permission", {
                            permissions: missingClientPermissions.map((perm) => `\`${perm}\``).join(", "),
                        }),
                    });
                }
            }

            if (command.permissions?.user) {
                if (!(message.member as GuildMember).permissions.has(command.permissions.user)) {
                    return await message.reply({
                        content: T(locale, "event.message.no_user_permission"),
                    });
                }

                if (command.permissions?.dev && this.client.config.owners) {
                    const isDev = this.client.config.owners.includes(message.author.id);
                    if (!isDev) return;
                }
            }

            if (command.vote && this.client.config.topGG) {
                const voted = await this.client.topGG.hasVoted(message.author.id);
                if (!voted) {
                    const voteBtn = new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setLabel(T(locale, "event.message.vote_button"))
                            .setURL(`https://top.gg/bot/${this.client.config.clientId}/vote`)
                            .setStyle(ButtonStyle.Link),
                    );

                    return await message.reply({
                        content: T(locale, "event.message.vote_message"),
                        components: [voteBtn],
                    });
                }
            }

            if (command.player) {
                if (command.player.voice) {
                    if (!(message.member as GuildMember).voice.channel) {
                        return await message.reply({
                            content: T(locale, "event.message.no_voice_channel", { command: command.name }),
                        });
                    }

                    if (!clientMember.permissions.has(PermissionFlagsBits.Connect)) {
                        return await message.reply({
                            content: T(locale, "event.message.no_connect_permission", { command: command.name }),
                        });
                    }

                    if (!clientMember.permissions.has(PermissionFlagsBits.Speak)) {
                        return await message.reply({
                            content: T(locale, "event.message.no_speak_permission", { command: command.name }),
                        });
                    }

                    if (
                        (message.member as GuildMember).voice.channel.type === ChannelType.GuildStageVoice &&
                        !clientMember.permissions.has(PermissionFlagsBits.RequestToSpeak)
                    ) {
                        return await message.reply({
                            content: T(locale, "event.message.no_request_to_speak", { command: command.name }),
                        });
                    }

                    if (clientMember.voice.channel && clientMember.voice.channelId !== (message.member as GuildMember).voice.channelId) {
                        return await message.reply({
                            content: T(locale, "event.message.different_voice_channel", {
                                channel: `<#${clientMember.voice.channelId}>`,
                                command: command.name,
                            }),
                        });
                    }
                }

                if (command.player.active) {
                    const queue = this.client.queue.get(message.guildId);
                    if (!(queue?.queue && queue.current)) {
                        return await message.reply({
                            content: T(locale, "event.message.no_music_playing"),
                        });
                    }
                }

                if (command.player.dj) {
                    const dj = await this.client.db.getDj(message.guildId);
                    if (dj?.mode) {
                        const djRole = await this.client.db.getRoles(message.guildId);
                        if (!djRole) {
                            return await message.reply({
                                content: T(locale, "event.message.no_dj_role"),
                            });
                        }

                        const hasDJRole = (message.member as GuildMember).roles.cache.some((role) =>
                            djRole.map((r) => r.roleId).includes(role.id),
                        );
                        if (!(hasDJRole && !(message.member as GuildMember).permissions.has(PermissionFlagsBits.ManageGuild))) {
                            return await message.reply({
                                content: T(locale, "event.message.no_dj_permission"),
                            });
                        }
                    }
                }
            }

            if (command.args && !args.length) {
                const embed = this.client
                    .embed()
                    .setColor(this.client.color.red)
                    .setTitle(T(locale, "event.message.missing_arguments"))
                    .setDescription(
                        T(locale, "event.message.missing_arguments_description", {
                            command: command.name,
                            examples: command.description.examples ? command.description.examples.join("\n") : "None",
                        }),
                    )
                    .setFooter({ text: T(locale, "event.message.syntax_footer") });
                await message.reply({ embeds: [embed] });
                return;
            }

            if (!this.client.cooldown.has(cmd)) {
                this.client.cooldown.set(cmd, new Collection());
            }
            const now = Date.now();
            const timestamps = this.client.cooldown.get(cmd)!;
            const cooldownAmount = (command.cooldown || 5) * 1000;

            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id)! + cooldownAmount;
                const timeLeft = (expirationTime - now) / 1000;
                if (now < expirationTime && timeLeft > 0.9) {
                    return await message.reply({
                        content: T(locale, "event.message.cooldown", { time: timeLeft.toFixed(1), command: cmd }),
                    });
                }
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            } else {
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            }

            if (args.includes("@everyone") || args.includes("@here")) {
                return await message.reply({
                    content: T(locale, "event.message.no_mention_everyone"),
                });
            }

            try {
                return command.run(this.client, ctx, ctx.args);
            } catch (error) {
                this.client.logger.error(error);
                await message.reply({
                    content: T(locale, "event.message.error", { error: error.message || "Unknown error" }),
                });
            } finally {
                const logs = this.client.channels.cache.get(this.client.config.commandLogs);
                if (logs) {
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: "Prefix - Command Logs",
                            iconURL: this.client.user?.avatarURL({ size: 2048 }),
                        })
                        .setColor(this.client.config.color.green)
                        .setDescription(
                            `**\`${command.name}\`** | Used By **${message.author.tag} \`${message.author.id}\`** From **${message.guild.name} \`${message.guild.id}\`**`,
                        )
                        .setTimestamp();

                    await (logs as TextChannel).send({ embeds: [embed] });
                }
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
