import { ChannelType } from 'discord.js';

import { Event, Lavamusic } from '../../structures/index.js';

export default class VoiceStateUpdate extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'voiceStateUpdate',
        });
    }

    public async run(oldState: any, newState: any): Promise<void> {
        const guildId = newState.guild.id;
        if (!guildId) return;

        const player = this.client.queue.get(guildId);
        if (!player) return;

        const vcConnection = player.node.manager.connections.get(newState.guild.id);
        if (vcConnection && vcConnection.channelId) {
            const vc = newState.guild.channels.cache.get(vcConnection.channelId);
            if (vc) {
                if (
                    newState.guild.members.cache.get(this.client.user.id) &&
                    !newState.guild.members.cache.get(this.client.user.id).voice.channelId
                ) {
                    if (player) {
                        return player.destroy();
                    }
                }

                if (
                    newState.id === this.client.user.id &&
                    newState.channelId &&
                    newState.channel.type == ChannelType.GuildStageVoice &&
                    newState.guild.members.me.voice.suppress
                ) {
                    if (
                        newState.guild.members.me.permissions.has(['Connect', 'Speak']) ||
                        newState.channel
                            .permissionsFor(newState.guild.members.me)
                            .has('MuteMembers')
                    ) {
                        await newState.guild.members.me.voice.setSuppressed(false).catch(() => {});
                    }
                }

                if (newState.id === this.client.user.id) return;

                if (
                    newState.id === this.client.user.id &&
                    !newState.serverDeaf &&
                    vc.permissionsFor(newState.guild.me).has('DeafenMembers')
                ) {
                    await newState.setDeaf(true);
                }

                if (newState.id === this.client.user.id && newState.serverMute && !player.paused) {
                    player.pause();
                }

                if (newState.id === this.client.user.id && !newState.serverMute && player.paused) {
                    player.pause();
                }

                let voiceChannel = newState.guild.channels.cache.get(vcConnection.channelId);

                if (newState.id === this.client.user.id && newState.channelId === null) return;

                if (!voiceChannel) return;

                if (voiceChannel.members.filter((x: any) => !x.user.bot).size <= 0) {
                    const server = await this.client.db.get_247(newState.guild.id);

                    if (!server) {
                        setTimeout(async () => {
                            const vc = player.node.manager.connections.get(newState.guild.id);
                            if (vc && !vc.channelId) return;

                            const playerVoiceChannel = newState.guild.channels.cache.get(
                                vc.channelId
                            );
                            if (
                                player &&
                                playerVoiceChannel &&
                                playerVoiceChannel.members.filter((x: any) => !x.user.bot).size <= 0
                            ) {
                                if (player) {
                                    player.destroy();
                                }
                            }
                        }, 5000);
                    } else {
                        setTimeout(async () => {
                            const vc = player.node.manager.connections.get(newState.guild.id);
                            if (vc && !vc.channelId) return;

                            const playerVoiceChannel = newState.guild.channels.cache.get(
                                vc.channelId
                            );
                            if (
                                player &&
                                playerVoiceChannel &&
                                playerVoiceChannel.members.filter((x: any) => !x.user.bot).size <= 0
                            ) {
                                if (player) {
                                    player.destroy();
                                }
                            }
                        }, 5000);
                    }
                }
            }
        } else {
            console.error('vcConnection or vcConnection.channelId is undefined.');
        }
    }
}

/**
 * Project: lavamusic
 * Author: Appu
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
