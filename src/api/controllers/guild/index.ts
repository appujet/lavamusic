import type Lavamusic from '@/structures/Lavamusic';
import HomeController from './home.controller';
import DjController from './dj.controller';
import MusicController from './music.controller';
import PlaylistController from './playlist.controller';
import LavalinkController from './lavalink.controller';

export default function setupControllers(client: Lavamusic) {
	return {
		homeController: new HomeController(client),
		djController: new DjController(client),
		musicController: new MusicController(client),
		playlistController: new PlaylistController(client),
		lavalinkController: new LavalinkController(client),
	};
}
