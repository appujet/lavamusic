import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import setupControllers from '@/api/controllers';

export default function musicRoute(client: Lavamusic): Router {
	const router = Router();
	const { musicController } = setupControllers(client);

	router.get('/', musicController.home);
	router.get('/search', musicController.search);

	return router;
}