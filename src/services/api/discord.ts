import { discordApi } from './base';
import { env } from '@/env';

export const createDiscordApiService = (accessToken: string | null) => {
	const headers: { Authorization?: string } = {};

	if (accessToken) {
		headers.Authorization = `Bearer ${accessToken}`;
	}

	return {
		discordUsersMe: async () => {
			const response = await discordApi.get('/users/@me', { headers });
			return response.data;
		},

		getUserGuilds: async () => {
			const response = await discordApi.get('/users/@me/guilds', { headers });
			return response.data;
		},

		getToken: async (code: string, redirectUri: string) => {
			const data = new URLSearchParams({
				client_id: env.CLIENT_ID,
				client_secret: env.DISCORD_OAUTH2_SECRET,
				grant_type: 'authorization_code',
				code,
				redirect_uri: redirectUri,
			});

			const response = await discordApi.post('/oauth2/token', data);
			return response.data;
		},

		refreshToken: async (refreshToken: string) => {
			const data = new URLSearchParams({
				client_id: env.CLIENT_ID,
				client_secret: env.DISCORD_OAUTH2_SECRET,
				grant_type: 'refresh_token',
				refresh_token: refreshToken,
			});

			const response = await discordApi.post('/oauth2/token', data);
			return response.data;
		},

		revokeToken: async (token: string) => {
			const data = new URLSearchParams({
				client_id: env.CLIENT_ID,
				client_secret: env.DISCORD_OAUTH2_SECRET,
				token,
			});

			const response = await discordApi.post('/oauth2/token/revoke', data);
			return response.data;
		},
	};
};
