import type Lavamusic from '@/structures/Lavamusic';
import HomeController from './home.controller';

export default function setupControllers(client: Lavamusic) {
	return {
		homeController: new HomeController(client),
	};
}
