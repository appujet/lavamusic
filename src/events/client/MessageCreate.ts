import { ChannelType, Collection, type Message, PermissionFlagsBits } from "discord.js";
import { Context, Event, type Lavamusic } from "../../structures/index.js";

export default class MessageCreate extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "messageCreate",
        });
    }

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
    public async run(message: Message): Promise<any> {
        if (message.author.bot) return;

        const setup = await this.client.db.getSetup(message.guildId);
        if (setup && setup.textId === message.channelId) {
            return this.client.emit("setupSystem", message);
        }

        const guild = await this.client.db.get(message.guildId);
        const mention = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
        if (mention.test(message.content)) {
            await message.reply({
                content: `Hey, my prefix for this server is \`${guild.prefix}\` Want more info? then do \`${guild.prefix}help\`\nStay Safe, Stay Awesome!`,
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

        if (!message.guild.members.resolve(this.client.user)?.permissions.has(PermissionFlagsBits.ViewChannel)) return;

        const clientMember = message.guild.members.resolve(this.client.user);
        if (!clientMember.permissions.has(PermissionFlagsBits.SendMessages)) {
            await message.author
                .send({
                    content: `I don't have **\`SendMessage\`** permission in \`${message.guild.name}\`\nchannel: <#${message.channelId}>`,
                })
                .catch(() => {});
            return;
        }

        if (!clientMember.permissions.has(PermissionFlagsBits.EmbedLinks)) {
            await message.reply({
                content: "I don't have **`EmbedLinks`** permission.",
            });
            return;
        }

        if (command.permissions) {
            if (command.permissions.client && !clientMember.permissions.has(command.permissions.client)) {
                await message.reply({
                    content: "I don't have enough permissions to execute this command.",
                });
                return;
            }

            if (command.permissions.user && !message.member.permissions.has(command.permissions.user)) {
                await message.reply({
                    content: "You don't have enough permissions to use this command.",
                });
                return;
            }

            if (command.permissions.dev && this.client.config.owners) {
                const isDev = this.client.config.owners.includes(message.author.id);
                if (!isDev) return;
            }
        }

        if (command.player) {
            if (command.player.voice) {
                if (!message.member.voice.channel) {
                    await message.reply({
                        content: `You must be connected to a voice channel to use this \`${command.name}\` command.`,
                    });
                    return;
                }

                if (!clientMember.permissions.has(PermissionFlagsBits.Connect)) {
                    await message.reply({
                        content: `I don't have \`CONNECT\` permissions to execute this \`${command.name}\` command.`,
                    });
                    return;
                }

                if (!clientMember.permissions.has(PermissionFlagsBits.Speak)) {
                    await message.reply({
                        content: `I don't have \`SPEAK\` permissions to execute this \`${command.name}\` command.`,
                    });
                    return;
                }

                if (
                    message.member.voice.channel.type === ChannelType.GuildStageVoice &&
                    !clientMember.permissions.has(PermissionFlagsBits.RequestToSpeak)
                ) {
                    await message.reply({
                        content: `I don't have \`REQUEST TO SPEAK\` permission to execute this \`${command.name}\` command.`,
                    });
                    return;
                }

                if (clientMember.voice.channel && clientMember.voice.channelId !== message.member.voice.channelId) {
                    await message.reply({
                        content: `You are not connected to <#${clientMember.voice.channelId}> to use this \`${command.name}\` command.`,
                    });
                    return;
                }
            }

            if (command.player.active) {
                const queue = this.client.queue.get(message.guildId);
                if (!queue?.queue && queue.current) {
                    await message.reply({
                        content: "Nothing is playing right now.",
                    });
                    return;
                }
            }

            if (command.player.dj) {
                const dj = await this.client.db.getDj(message.guildId);
                if (dj?.mode) {
                    const djRole = await this.client.db.getRoles(message.guildId);
                    if (!djRole) {
                        await message.reply({
                            content: "DJ role is not set.",
                        });
                        return;
                    }
                    const findDJRole = message.member.roles.cache.find((x: any) => djRole.map((y: any) => y.roleId).includes(x.id));
                    if (!findDJRole) {
                        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                            await message
                                .reply({
                                    content: "You need to have the DJ role to use this command.",
                                })
                                .then((msg) => setTimeout(() => msg.delete(), 5000));
                            return;
                        }
                    }
                }
            }
        }

        if (command.args && !args.length) {
            const embed = this.client
                .embed()
                .setColor(this.client.color.red)
                .setTitle("Missing Arguments")
                .setDescription(
                    `Please provide the required arguments for the \`${command.name}\` command.\n\nExamples:\n${
                        command.description.examples ? command.description.examples.join("\n") : "None"
                    }`,
                )
                .setFooter({ text: "Syntax: [] = optional, <> = required" });
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
                await message.reply({
                    content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd}\` command.`,
                });
                return;
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        } else {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        if (args.includes("@everyone") || args.includes("@here")) {
            await message.reply({
                content: "You can't use this command with everyone or here.",
            });
            return;
        }

        try {
            return command.run(this.client, ctx, ctx.args);
        } catch (error) {
            this.client.logger.error(error);
            await message.reply({ content: `An error occurred: \`${error}\`` });
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
