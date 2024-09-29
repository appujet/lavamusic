import type Lavamusic from '../../structures/Lavamusic';
import DiscordMiddleware from './discord.middleware';

export default function setupMiddlewares(_client: Lavamusic) {
	return {
		discordMiddleware: new DiscordMiddleware(),
	};
}
