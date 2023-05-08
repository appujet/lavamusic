import { Event, Context } from '../../structures/index.js';
import { Collection, ChannelType, InteractionType, PermissionFlagsBits, } from 'discord.js';
export default class InteractionCreate extends Event {
    constructor(client, file) {
        super(client, file, {
            name: 'interactionCreate',
        });
    }
    async run(interaction) {
        if (interaction.isButton()) {
            const setup = await this.client.prisma.setup.findUnique({
                where: {
                    guildId: interaction.guildId,
                },
            });
            if (setup && interaction.channelId === setup.textId && interaction.message.id === setup.messageId) {
                return this.client.emit('setupButtons', interaction);
            }
        }
        if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            if (interaction.commandName == "play") {
                const song = interaction.options.getString("song");
                let player = this.client.queue.get(interaction.guildId);
                if (!player) {
                    player = await this.client.queue.create(interaction.guild, interaction.member.voice.channel, interaction.channel, this.client.shoukaku.getNode());
                }
                const res = await this.client.queue.search(song);
                let songs = [];
                switch (res.loadType) {
                    case 'LOAD_FAILED':
                        break;
                    case 'NO_MATCHES':
                        break;
                    case 'TRACK_LOADED':
                        break;
                    case 'PLAYLIST_LOADED':
                        break;
                    case 'SEARCH_RESULT':
                        songs.push({
                            name: res.tracks[0].info.title,
                            value: res.tracks[0].info.uri
                        });
                        break;
                    default:
                        break;
                }
                interaction.respond(songs).catch(() => { });
            }
        }
        else if (interaction.type === InteractionType.ApplicationCommand) {
            const { commandName } = interaction;
            const command = this.client.commands.get(interaction.commandName);
            if (!command)
                return;
            const ctx = new Context(interaction, interaction.options.data);
            ctx.setArgs(interaction.options.data);
            if (!interaction.inGuild() ||
                !interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ViewChannel))
                return;
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
                return await interaction.member
                    .send({
                    content: `I don't have **\`SendMessage\`** permission in \`${interaction.guild.name}\`\nchannel: <#${interaction.channelId}>`,
                })
                    .catch(() => { });
            }
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks))
                return await interaction.reply({
                    content: "I don't have **`EmbedLinks`** permission.",
                });
            if (command.permissions) {
                if (command.permissions.client) {
                    if (!interaction.guild.members.me.permissions.has(command.permissions.client))
                        return await interaction.reply({
                            content: "I don't have enough permissions to execute this command.",
                        });
                }
                if (command.permissions.user) {
                    if (!interaction.member.permissions.has(command.permissions.user)) {
                        await interaction.reply({
                            content: "You don't have enough permissions to use this command.",
                            ephemeral: true,
                        });
                        return;
                    }
                }
                if (command.permissions.dev) {
                    if (this.client.config.owners) {
                        const findDev = this.client.config.owners.find((x) => x === interaction.user.id);
                        if (!findDev)
                            return;
                    }
                }
            }
            if (command.player) {
                if (command.player.voice) {
                    if (!interaction.member.voice.channel)
                        return await interaction.reply({
                            content: `You must be connected to a voice channel to use this \`${command.name}\` command.`,
                        });
                    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Speak))
                        return await interaction.reply({
                            content: `I don't have \`CONNECT\` permissions to execute this \`${command.name}\` command.`,
                        });
                    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Speak))
                        return await interaction.reply({
                            content: `I don't have \`SPEAK\` permissions to execute this \`${command.name}\` command.`,
                        });
                    if (interaction.member.voice.channel.type === ChannelType.GuildStageVoice &&
                        !interaction.guild.members.me.permissions.has(PermissionFlagsBits.RequestToSpeak))
                        return await interaction.reply({
                            content: `I don't have \`REQUEST TO SPEAK\` permission to execute this \`${command.name}\` command.`,
                        });
                    if (interaction.guild.members.me.voice.channel) {
                        if (interaction.guild.members.me.voice.channelId !== interaction.member.voice.channelId)
                            return await interaction.reply({
                                content: `You are not connected to ${interaction.guild.members.me.voice.channel} to use this \`${command.name}\` command.`,
                            });
                    }
                }
                if (command.player.active) {
                    if (!this.client.queue.get(interaction.guildId))
                        return await interaction.reply({
                            content: 'Nothing is playing right now.',
                        });
                    if (!this.client.queue.get(interaction.guildId).queue)
                        return await interaction.reply({
                            content: 'Nothing is playing right now.',
                        });
                    if (!this.client.queue.get(interaction.guildId).current)
                        return await interaction.reply({
                            content: 'Nothing is playing right now.',
                        });
                }
                if (command.player.dj) {
                    const djRole = await this.client.prisma.dj.findUnique({
                        where: {
                            guildId: interaction.guildId,
                        },
                        include: { roles: true },
                    });
                    if (djRole && djRole.mode) {
                        const findDJRole = interaction.member.roles.cache.find((x) => djRole.roles.map((y) => y.roleId).includes(x.id));
                        if (!findDJRole) {
                            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                                return await interaction.reply({
                                    content: 'You need to have the DJ role to use this command.',
                                    ephemeral: true,
                                });
                            }
                        }
                    }
                }
            }
            if (!this.client.cooldown.has(commandName)) {
                this.client.cooldown.set(commandName, new Collection());
            }
            const now = Date.now();
            const timestamps = this.client.cooldown.get(commandName);
            const cooldownAmount = Math.floor(command.cooldown || 5) * 1000;
            if (!timestamps.has(interaction.user.id)) {
                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            }
            else {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                const timeLeft = (expirationTime - now) / 1000;
                if (now < expirationTime && timeLeft > 0.9) {
                    return interaction.reply({
                        content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`,
                    });
                }
                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            }
            if (ctx.args.includes('@everyone') || ctx.args.includes('@here'))
                return interaction.reply({
                    content: "You can't mention everyone or here.",
                    ephemeral: true,
                });
            try {
                await command.run(this.client, ctx, ctx.args);
            }
            catch (error) {
                this.client.logger.error(error);
                await interaction.reply({ content: `An error occurred: \`${error}\`` });
            }
        }
    }
}
/**
 * Project: lavamusic
 * user: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
//# sourceMappingURL=InteractionCreate.js.map