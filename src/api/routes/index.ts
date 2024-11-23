import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import homeRoute from './home.route';
import musicRoute from './music.route';
import guildRoute from './guild/';
import discordRoute from './discord.route';

export default function setupRoutes(client: Lavamusic): Router {
	const router = Router();

	router.use('/', homeRoute(client));
	router.use('/music', musicRoute(client));
	router.use('/guild', guildRoute(client));
	router.use('/discord', discordRoute(client));

	return router;
}
