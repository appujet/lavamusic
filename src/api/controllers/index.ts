import type Lavamusic from '@/structures/Lavamusic';
import HomeController from './home.controller';
import MusicController from './music.controller';
import DiscordController from './discord.controller';

export default function setupControllers(client: Lavamusic) {
	return {
		homeController: new HomeController(client),
		musicController: new MusicController(client),
		discordController: new DiscordController(client),
	};
}
