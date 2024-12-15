import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import setupControllers from '@/api/controllers';

export default function homeRoute(client: Lavamusic): Router {
	const router = Router();
	const { homeController } = setupControllers(client);

	router.get('/', homeController.getHome);
	router.get('/stats', homeController.getStats);

	return router;
}