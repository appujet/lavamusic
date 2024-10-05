import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import homeRoute from './home.route';

export default function guildRoute(client: Lavamusic): Router {
	const router = Router();

	router.use('/', homeRoute(client));

	return router;
}
