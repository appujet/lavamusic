import axios from 'axios';

const BASE_URLS = {
	discord: 'https://discord.com/api',
};

const createApiInstance = (baseURL: string) => {
	return axios.create({
		baseURL,
		timeout: 10000,
	});
};

export const discordApi = createApiInstance(BASE_URLS.discord);