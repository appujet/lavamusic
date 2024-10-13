import { discordApi } from './base';

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
	};
};
