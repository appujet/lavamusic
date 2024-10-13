import type Lavamusic from '@/structures/Lavamusic';
import DiscordMiddleware from './discord.middleware';
import GuildMiddleware from './guild.middleware';

export default function setupMiddlewares(client: Lavamusic) {
	return {
		discordMiddleware: new DiscordMiddleware(),
		guildMiddleware: new GuildMiddleware(client),
	};
}
