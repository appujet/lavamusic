import type Lavamusic from '@/structures/Lavamusic';
import HomeController from './home.controller';
import DjController from './dj.controller';

export default function setupControllers(client: Lavamusic) {
	return {
		homeController: new HomeController(client),
		djController: new DjController(client),
	};
}
