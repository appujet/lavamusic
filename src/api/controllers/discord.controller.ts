import type { Request, Response } from 'express';
import { response } from '@/api/base';
import type Lavamusic from '@/structures/Lavamusic';
import { PermissionsBitField, PermissionFlagsBits } from 'discord.js';
import { createDiscordApiService } from '@/services/api/discord';
import { env } from '@/env';
import { z } from 'zod';

class DiscordController {
	private client: Lavamusic;
	private discordApi: typeof createDiscordApiService;

	constructor(client: Lavamusic) {
		this.client = client;
		this.discordApi = createDiscordApiService;
	}

	public home = (_req: Request, res: Response): void => {
		const fullYear = new Date().getFullYear();
		response.success(res, {
			message: `「 Discord Home API 」. TSR Lavamusic REST API. Copyright © TheSkinnyRat ${fullYear}.`,
		});
	};

	public loginUri = async (req: Request, res: Response): Promise<void> => {
		const schema = z.object({
			redirectUri: z.string(),
			responseType: z.string(),
			scope: z.string(),
			state: z.string(),
		});

		try {
			const { redirectUri, responseType, scope, state } = schema.parse(req.body);
			const discordLoginUri = `https://discord.com/oauth2/authorize?client_id=${env.CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${encodeURIComponent(responseType)}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`;

			response.success(res, { discordLoginUri });
		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, `Validation error: ${error.message}`);
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};

	public token = async (req: Request, res: Response): Promise<void> => {
		const schema = z.object({
			code: z.string(),
			redirectUri: z.string(),
		});

		try {
			const { code, redirectUri } = schema.parse(req.body);
			const discordApi = this.discordApi(null);
			const tokenResponse = await discordApi.getToken(code, redirectUri);

			response.success(res, tokenResponse);
		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, `Validation error: ${error.message}`);
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};

	public tokenRefresh = async (req: Request, res: Response): Promise<void> => {
		const schema = z.object({
			refreshToken: z.string(),
		});

		try {
			const { refreshToken } = schema.parse(req.body);
			const discordApi = this.discordApi(null);
			const refreshResponse = await discordApi.refreshToken(refreshToken);

			response.success(res, refreshResponse);
		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, `Validation error: ${error.message}`);
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};

	public tokenRevoke = async (req: Request, res: Response): Promise<void> => {
		const schema = z.object({
			token: z.string(),
		});

		try {
			const { token } = schema.parse(req.body);
			const discordApi = this.discordApi(null);
			const revokeResponse = await discordApi.revokeToken(token);

			response.success(res, revokeResponse);
		} catch (error) {
			if (error instanceof z.ZodError) {
				response.error(res, 400, `Validation error: ${error.message}`);
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};

	public usersMe = async (req: Request, res: Response): Promise<void> => {
		try {
			const accessToken = req.headers.authorization;
			const discordApi = this.discordApi(accessToken ?? null);
			const userResponse = await discordApi.discordUsersMe();

			response.success(res, userResponse);
		} catch (error: any) {
			if (error?.response?.status === 401) {
				response.error(res, 401, 'Unauthorized');
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};

	public usersMeGuilds = async (req: Request, res: Response): Promise<void> => {
		try {
			const accessToken = req.headers.authorization;
			const discordApi = this.discordApi(accessToken ?? null);
			const guildsResponse = await discordApi.getUserGuilds();

			const formattedGuilds = guildsResponse.map((guild: any) => ({
				id: guild.id,
				name: guild.name,
				icon: guild.icon,
				guildManager: new PermissionsBitField(BigInt(guild.permissions)).has(PermissionFlagsBits.ManageGuild),
				botStatus: {
					isMember: Boolean(this.client.guilds.cache.get(guild.id)),
				},
			}));

			response.success(res, formattedGuilds);
		} catch (error: any) {
			if (error?.response?.status === 401) {
				response.error(res, 401, 'Unauthorized');
			} else {
				response.error(res, 500, `Internal Server Error: ${error}`);
			}
		}
	};
}

export default DiscordController;