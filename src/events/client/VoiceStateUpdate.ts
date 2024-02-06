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
                newState.channel.permissionsFor(newState.guild.members.me).has('MuteMembers')
            ) {
                await newState.guild.members.me.voice.setSuppressed(false).catch(() => {});
            }
        }
        if (newState.id == this.client.user.id) return;
        const vc = newState.guild.channels.cache.get(
            player.node.manager.connections.get(newState.guild.id).channelId
        );
        if (
            newState.id === this.client.user.id &&
            !newState.serverDeaf &&
            vc &&
            vc.permissionsFor(newState.guild.member.me).has('DeafenMembers')
        )
            await newState.setDeaf(true);
        if (newState.id === this.client.user.id && newState.serverMute && !player.paused)
            player.pause();
        if (newState.id === this.client.user.id && !newState.serverMute && player.paused)
            player.pause();

        let voiceChannel = newState.guild.channels.cache.get(
            player.node.manager.connections.get(newState.guild.id).channelId
        );

        if (newState.id === this.client.user.id && newState.channelId === null) return;

        if (!voiceChannel) return;
        if (voiceChannel.members.filter((x: any) => !x.user.bot).size <= 0) {
            const server = this.client.db.get_247(newState.guild.id);
            if (!server) {
                setTimeout(async () => {
                    const playerVoiceChannel = newState.guild.channels.cache.get(
                        player.node.manager.connections.get(newState.guild.id).channelId
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
                if (server) return;
                setTimeout(async () => {
                    const playerVoiceChannel = newState.guild.channels.cache.get(
                        player.node.manager.connections.get(newState.guild.id).channelId
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
}
