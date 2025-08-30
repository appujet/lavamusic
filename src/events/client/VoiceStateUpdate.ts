import { ChannelType, type GuildMember, type VoiceState } from "discord.js";
import { Event, type Lavamusic } from "../../structures/index";

export default class VoiceStateUpdate extends Event {
   constructor(client: Lavamusic, file: string) {
   	super(client, file, {
   		name: "voiceStateUpdate",
   	});
   }

   private delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

   public async run(oldState: VoiceState, newState: VoiceState): Promise<void> {
   	const guildId = newState.guild.id;
   	if (!guildId) return;

   	const player = this.client.manager.getPlayer(guildId);
   	if (!player) return;

   	if (!player?.voiceChannelId) return;

   	const is247 = await this.client.db.get_247(guildId);

   	const botVoiceChannelId = newState.guild.members.cache.get(this.client.user!.id)?.voice.channelId;

   	if (newState.id === this.client.user!.id && oldState.channelId && !newState.channelId) {
   		if (!is247) {
   			try {
   				await player.destroy();
   			} catch (err) {
   				this.client.logger?.error?.("destroy() on bot leave failed", err);
   			}
   		}
   		return;
   	}

   	if (!botVoiceChannelId && !is247 && player) {
   		try {
   			await player.destroy();
   		} catch (err) {
   			this.client.logger?.error?.("destroy() when bot not in VC failed", err);
   		}
   		return;
   	}

   	let type: "join" | "leave" | "move" | null = null;

   	if (!oldState.channelId && newState.channelId) {
   		type = "join";
   	} else if (oldState.channelId && !newState.channelId) {
   		type = "leave";
   	} else if (
   		oldState.channelId &&
   		newState.channelId &&
   		oldState.channelId !== newState.channelId
   	) {
   		type = "move";
   	}

   	try {
   		if (type === "join") {
   			await this.handle.join(newState, this.client);
   		} else if (type === "leave") {
   			await this.handle.leave(newState, this.client);
   		} else if (type === "move") {
   			await this.handle.move(newState, this.client);
   		}
   	} catch (err) {
   		this.client.logger?.error?.("VoiceStateUpdate handler error", err);
   	}
   }

   handle = {
   	async join(newState: VoiceState, client: Lavamusic) {
   		await this.delay(3000);
   		const bot = newState.guild.voiceStates.cache.get(client.user!.id);
   		if (!bot) return;

   		if (
   			bot.channelId &&
   			bot.channel?.type === ChannelType.GuildStageVoice &&
   			bot.suppress
   		) {
   			if (
   				bot.channel &&
   				bot.member &&
   				bot.channel.permissionsFor(bot.member!).has("MuteMembers")
   			) {
   				await bot.setSuppressed(false);
   			}
   		}

   		const player = client.manager.getPlayer(newState.guild.id);
   		if (!player) return;

   		if (!player?.voiceChannelId) return;

   		const vc = newState.guild.channels.cache.get(player.voiceChannelId);
   		if (!vc) return;
   		
   		if (newState.id === client.user?.id && !newState.serverDeaf) {
   			const permissions = vc.permissionsFor(newState.guild.members.me!);
   			if (permissions?.has("DeafenMembers")) {
   				await newState.setDeaf(true);
   			}
   		}

   		if (newState.id === client.user?.id) {
   			if (newState.serverMute && !player.paused) {
   				await player.pause();
   			} else if (!newState.serverMute && player.paused) {
   				await player.resume();
   			}
   		}
   	},

   	async leave(newState: VoiceState, client: Lavamusic) {
   		const player = client.manager.getPlayer(newState.guild.id);
   		if (!player) return;
   		if (!player?.voiceChannelId) return;
   		const is247 = await client.db.get_247(newState.guild.id);
   		const vc = newState.guild.channels.cache.get(player.voiceChannelId);
   		if (!vc) return;
   		if (vc.members.filter((m: GuildMember) => !m.user.bot).size === 0) {
   			setTimeout(async () => {
   				const latestPlayer = client.manager.getPlayer(newState.guild.id);
   				if (!latestPlayer?.voiceChannelId) return;
   				const ch = newState.guild.channels.cache.get(latestPlayer.voiceChannelId);
   				if (ch && ch.members.filter((m: GuildMember) => !m.user.bot).size === 0) {
   					if (!is247) {
   						try {
   							await latestPlayer.destroy();
   						} catch (err) {
   							client.logger?.error?.("destroy() after 5s no-listeners failed", err);
   						}
   					}
   				}
   			}, 5000);
   		}
   	},

   	async move(newState: VoiceState, client: Lavamusic) {
   		await this.delay(3000);
   		const bot = newState.guild.voiceStates.cache.get(client.user!.id);
   		if (!bot) return;

   		if (
   			bot.channelId &&
   			bot.channel?.type === ChannelType.GuildStageVoice &&
   			bot.suppress
   		) {
   			if (
   				bot.channel &&
   				bot.member &&
   				bot.channel.permissionsFor(bot.member!).has("MuteMembers")
   			) {
   				await bot.setSuppressed(false);
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
* https://discord.gg/YQsGbTwPBx
*/
