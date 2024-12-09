import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import homeRoute from './home.route';
import djRoute from './dj.route';
import musicRoute from './music.route';
import playlistRoute from './playlist.route';
import lavalinkRoute from './lavalink.route';

export default function guildRoute(client: Lavamusic): Router {
	const router = Router();

	router.use('/', homeRoute(client));
	router.use('/:guildId/dj', djRoute(client));
	router.use('/:guildId', musicRoute(client));
	router.use('/:guildId/playlist', playlistRoute(client));
	router.use('/:guildId/lavalink', lavalinkRoute(client));

	return router;
}
