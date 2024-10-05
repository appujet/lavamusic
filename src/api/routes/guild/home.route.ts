import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import setupControllers from '@/api/controllers/guild';

export default function homeRoute(client: Lavamusic): Router {
	const router = Router();
	const { homeController } = setupControllers(client);

	router.get('/', homeController.home);

	return router;
}