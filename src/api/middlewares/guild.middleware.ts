import type { Request, Response, NextFunction } from 'express';
import { response } from '@/api/base';
import type Lavamusic from '@/structures/Lavamusic';
import { type Guild, type User, PermissionsBitField, type SendableChannels } from 'discord.js';
import type { Player } from 'lavalink-client';
import { createDiscordApiService } from '@/services/api/discord';

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
			const guild = this.client.guilds.cache.get(guildId);
			const user = await discordApi.discordUsersMe();

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
		} catch (error) {
			response.error(res, 500, `Internal Server Error: ${error}`);
			return;
		}
	};

	public guildManager = async (req: GuildRequest, res: Response, next: NextFunction): Promise<void> => {
		const guildId = req.params.guildId;

		try {
			const guild = this.client.guilds.cache.get(guildId);
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

	public guildExists = (req: GuildRequest, res: Response, next: NextFunction): void => {
		const guildId = req.params.guildId;

		const guild = this.client.guilds.cache.get(guildId);

		if (!guild) {
			response.error(res, 404, 'Guild not found');
			return;
		}

		req.guild = guild;
		next();
	};

	public playerExists = (req: GuildRequest, res: Response, next: NextFunction): void => {
		const guildId = req.params.guildId;

		const player = this.client.manager.players.get(guildId);

		if (!player) {
			response.error(res, 404, 'Player not found');
			return;
		}

		req.player = player;
		next();
	};

	public channelExists = (req: GuildRequest, res: Response, next: NextFunction): void => {
		const guildId = req.params.guildId;

		const guild = this.client.guilds.cache.get(guildId);
		const player = this.client.manager.players.get(guildId);
		const channel = guild?.channels.cache.get(player?.voiceChannelId ?? '');

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
