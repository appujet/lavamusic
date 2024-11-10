import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import homeRoute from './home.route';
import djRoute from './dj.route';
import musicRoute from './music.route';

export default function guildRoute(client: Lavamusic): Router {
	const router = Router();

	router.use('/', homeRoute(client));
	router.use('/:guildId/dj', djRoute(client));
	router.use('/:guildId', musicRoute(client));

	return router;
}
