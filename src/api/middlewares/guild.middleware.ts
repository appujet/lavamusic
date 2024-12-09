import type { Request, Response, NextFunction } from 'express';
import { response } from '@/api/base';
import type Lavamusic from '@/structures/Lavamusic';
import { type Guild, type User, PermissionsBitField, type SendableChannels } from 'discord.js';
import type { Player } from 'lavalink-client';
import { createDiscordApiService } from '@/services/api/discord';
import type { JsonArray, JsonObject, JsonValue } from '@prisma/client/runtime/library';

interface GuildRequest extends Request {
	user?: User;
	guild?: Guild;
	player?: Player;
	channel?: SendableChannels;
}

class GuildMiddleware {
	private client: Lavamusic;
	private discordApi: typeof createDiscordApiService;

	constructor(client: Lavamusic) {
		this.client = client;
		this.discordApi = createDiscordApiService;
	}

	public auth = async (req: GuildRequest, res: Response, next: NextFunction): Promise<void> => {
		const accessToken = req.headers.authorization;
		const guildId = req.params.guildId;

		if (!accessToken) {
			response.error(res, 401, 'Unauthorized');
			return;
		}

		try {
			const discordApi = this.discordApi(accessToken);
			const guild = await this.client.guilds.fetch(guildId);
			const userApi = await discordApi.discordUsersMe();
			const user = await this.client.users.fetch(userApi?.id);

			if (!user) {
				response.error(res, 401, 'Unauthorized');
				return;
			}

			const member = await guild?.members.fetch(user.id);

			if (!member) {
				response.error(res, 401, 'Unauthorized');
				return;
			}

			req.user = user;
			next();
		} catch (error: any) {
			if (error?.response?.status === 401) {
				response.error(res, 401, 'Unauthorized');
				return;
			}
			response.error(res, 500, `Internal Server Error: ${error}`);
			return;
		}
	};

	public optionalAuth = async (req: GuildRequest, res: Response, next: NextFunction): Promise<void> => {
		const accessToken = req.headers.authorization;
		const guildId = req.params.guildId;
		let user: User | undefined;

		try {
			const guildConfig = await this.client.dbNew.getGuildConfig(guildId);
			const config = guildConfig?.Config as JsonObject;

			if (config?.authMode) {
				if (!accessToken) {
					response.error(res, 400, 'Should contain Authorization Header');
					return;
				}
			}

			if (accessToken) {
				const discordApi = this.discordApi(accessToken);
				const userApi = await discordApi.discordUsersMe();
				user = await this.client.users.fetch(userApi?.id);

				if (!user) {
					response.error(res, 401, 'Unauthorized');
					return;
				}

				try {
					const guild = await this.client.guilds.fetch(guildId);
					const member = await guild?.members.fetch(user.id);

					if (!member) {
						response.error(res, 401, 'Unauthorized');
						return;
					}
				} catch (error) {
					response.error(res, 401, 'Unauthorized');
					return;
				}
			}

			req.user = user;
			next();
		} catch (error: any) {
			if (error?.response?.status === 401) {
				response.error(res, 401, 'Unauthorized');
				return;
			}
			response.error(res, 500, `Internal Server Error: ${error}`);
			return;
		}
	};

	public guildManager = async (req: GuildRequest, res: Response, next: NextFunction): Promise<void> => {
		const guildId = req.params.guildId;

		try {
			const guild = await this.client.guilds.fetch(guildId);
			const member = await guild?.members.fetch(req.user?.id ?? '');

			if (!member) {
				response.error(res, 401, 'Unauthorized');
				return;
			}
			if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
				response.error(res, 403, 'Forbidden, missing manage guild permission');
				return;
			}

			req.guild = guild;
			next();
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
			return;
		}
	};

	public dj = async (req: GuildRequest, res: Response, next: NextFunction): Promise<void> => {
		const guildId = req.params.guildId;

		try {
			const guildDj = await this.client.dbNew.getGuildDj(guildId);
			if (!guildDj?.Mode) {
				next();
				return;
			}

			const guild = await this.client.guilds.fetch(guildId);
			const member = await guild?.members.fetch(req.user?.id ?? '');
			const roles = guildDj.Roles as JsonArray;

			if (!member) {
				response.error(res, 401, 'Unauthorized');
				return;
			}

			if (member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
				next();
				return;
			}

			if (!roles.length) {
				response.error(res, 403, 'Forbidden, not enough permissions');
				return;
			}

			const isDj = roles.some((role: JsonValue) => member.roles.cache.has(role as string));
			if (!isDj) {
				response.error(res, 403, 'Forbidden, not enough permissions');
				return;
			}

			next();
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
			return;
		}
	};

	public guildExists = async (req: GuildRequest, res: Response, next: NextFunction): Promise<void> => {
		const guildId = req.params.guildId;

		const guild = await this.client.guilds.fetch(guildId);

		if (!guild) {
			response.error(res, 404, 'Guild not found');
			return;
		}

		req.guild = guild;
		next();
	};

	public playerExists = async (req: GuildRequest, res: Response, next: NextFunction): Promise<void> => {
		const guildId = req.params.guildId;

		const player = this.client.manager.players.get(guildId);

		if (!player) {
			response.error(res, 404, 'Player not found');
			return;
		}

		req.player = player;
		next();
	};

	public channelExists = async (req: GuildRequest, res: Response, next: NextFunction): Promise<void> => {
		const guildId = req.params.guildId;

		const guild = await this.client.guilds.fetch(guildId);
		const player = this.client.manager.players.get(guildId);
		const channel = await guild?.channels.fetch(player?.textChannelId ?? player?.voiceChannelId ?? '');

		if (!(channel?.isSendable())) {
			response.error(res, 404, 'Channel not found or not sendable');
			return;
		}

		req.channel = channel;
		next();
	};
}

export default GuildMiddleware;
export type { GuildRequest };
