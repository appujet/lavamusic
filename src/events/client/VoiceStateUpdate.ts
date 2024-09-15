import { ChannelType, type GuildMember, type VoiceState } from "discord.js";
import { Event, type Lavamusic } from "../../structures/index";

export default class VoiceStateUpdate extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "voiceStateUpdate",
        });
    }

    public async run(_oldState: VoiceState, newState: VoiceState): Promise<any> {
        const guildId = newState.guild.id;
        if (!guildId) return;

        const player = this.client.manager.getPlayer(guildId);
        if (!player) return;

        if (!player?.voiceChannelId) return;

        const vc = newState.guild.channels.cache.get(player.voiceChannelId);
        if (!(vc && vc.members instanceof Map)) return;

        const is247 = await this.client.db.get_247(guildId);

        if (!(newState.guild.members.cache.get(this.client.user.id)?.voice.channelId || !is247) && player) {
            return player.destroy();
        }

        if (
            newState.id === this.client.user.id &&
            newState.channelId &&
            newState.channel.type === ChannelType.GuildStageVoice &&
            newState.guild.members.me.voice.suppress
        ) {
            if (
                newState.guild.members.me.permissions.has(["Connect", "Speak"]) ||
                newState.channel.permissionsFor(newState.guild.members.me).has("MuteMembers")
            ) {
                await newState.guild.members.me.voice.setSuppressed(false).catch(() => {});
            }
        }

        if (newState.id === this.client.user.id && !newState.serverDeaf) {
            const permissions = vc.permissionsFor(newState.guild.members.me);
            if (permissions?.has("DeafenMembers")) {
                await newState.setDeaf(true);
            }
        }

        if (newState.id === this.client.user.id) {
            if (newState.serverMute && !player.paused) {
                player.pause();
            } else if (!newState.serverMute && player.paused) {
                player.pause();
            }
        }

        if (vc.members instanceof Map && [...vc.members.values()].filter((x: GuildMember) => !x.user.bot).length <= 0) {
            setTimeout(async () => {
                if (!player?.voiceChannelId) return;

                const playerVoiceChannel = newState.guild.channels.cache.get(player?.voiceChannelId);
                if (
                    player &&
                    playerVoiceChannel &&
                    playerVoiceChannel.members instanceof Map &&
                    [...playerVoiceChannel.members.values()].filter((x: GuildMember) => !x.user.bot).length <= 0
                ) {
                    if (!is247) {
                        player.destroy();
                    }
                }
            }, 5000);
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
