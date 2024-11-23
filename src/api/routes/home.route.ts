import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import setupMiddlewares from '@/api/middlewares';
import setupControllers from '@/api/controllers';

export default function homeRoute(client: Lavamusic): Router {
	const router = Router();
	const { discordMiddleware } = setupMiddlewares(client);
	const { homeController } = setupControllers(client);

	router.get('/', homeController.getHome);
	router.get('/stats', discordMiddleware.isAccessTokenProvided, homeController.getStats);

	return router;
}