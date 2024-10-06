import { ChannelType, type GuildMember, type VoiceState } from 'discord.js';
import { Event, type Lavamusic } from '../../structures/index';

export default class VoiceStateUpdate extends Event {
	constructor(client: Lavamusic, file: string) {
		super(client, file, {
			name: 'voiceStateUpdate',
		});
	}

	public async run(oldState: VoiceState, newState: VoiceState): Promise<any> {
		const guildId = newState.guild.id;
		if (!guildId) return;

		const player = this.client.manager.getPlayer(guildId);
		if (!player) return;

		if (!player?.voiceChannelId) return;

		const vc = newState.guild.channels.cache.get(player.voiceChannelId);
		if (!(vc && vc.members instanceof Map)) return;

		const is247 = await this.client.db.get_247(guildId);

		if (!(newState.guild.members.cache.get(this.client.user!.id)?.voice.channelId || !is247) && player) {
			return player.destroy();
		}

		let type: 'join' | 'leave' | 'move' | null = null;

		if (!oldState.channelId && newState.channelId) {
			type = 'join';
		} else if (oldState.channelId && !newState.channelId) {
			type = 'leave';
		} else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
			type = 'move';
		}

		if (type === 'join') {
			this.handale.join(newState, this.client);
		} else if (type === 'leave') {
			this.handale.leave(newState, this.client);
		} else if (type === 'move') {
			this.handale.move(newState, this.client);
		}
	}

	handale = {
		async join(newState: VoiceState, client: Lavamusic) {
			await new Promise((resolve) => setTimeout(resolve, 3000));
			const bot = newState.guild.voiceStates.cache.get(client.user!.id);
			if (!bot) return;

			if (
				bot.id === client.user?.id &&
				bot.channelId &&
				bot.channel?.type === ChannelType.GuildStageVoice &&
				bot.suppress
			) {
				if (bot.channel && bot.member && bot.channel.permissionsFor(bot.member!).has('MuteMembers')) {
					await bot.setSuppressed(false)
				}
			}

			const player = client.manager.getPlayer(newState.guild.id);
			if (!player) return;

			if (!player?.voiceChannelId) return;

			const vc = newState.guild.channels.cache.get(player.voiceChannelId);
			if (!(vc && vc.members instanceof Map)) return;
			if (newState.id === client.user?.id && !newState.serverDeaf) {
				const permissions = vc.permissionsFor(newState.guild.members.me!);
				if (permissions?.has('DeafenMembers')) {
					await newState.setDeaf(true);
				}
			}

			if (newState.id === client.user?.id) {
				if (newState.serverMute && !player.paused) {
					player.pause();
				} else if (!newState.serverMute && player.paused) {
					player.resume();
				}
			}
		},

		async leave(newState: VoiceState, client: Lavamusic) {
			const player = client.manager.getPlayer(newState.guild.id);
			if (!player) return;
			if (!player?.voiceChannelId) return;
			const is247 = await client.db.get_247(newState.guild.id);
			const vc = newState.guild.channels.cache.get(player.voiceChannelId);
			if (!(vc && vc.members instanceof Map)) return;

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
		},

		async move(newState: VoiceState, client: Lavamusic) {
			// delay for 3 seconds
			await new Promise((resolve) => setTimeout(resolve, 3000));
			const bot = newState.guild.voiceStates.cache.get(client.user!.id);
			if (!bot) return;

			if (
				bot.id === client.user?.id &&
				bot.channelId &&
				bot.channel?.type === ChannelType.GuildStageVoice &&
				bot.suppress
			) {
				if (bot.channel && bot.member && bot.channel.permissionsFor(bot.member!).has('MuteMembers')) {
					await bot.setSuppressed(false)
				}
			}
		},
	};
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
