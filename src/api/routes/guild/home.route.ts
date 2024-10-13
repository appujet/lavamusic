import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import setupControllers from '@/api/controllers/guild';
import setupMiddlewares from '@/api/middlewares';

export default function homeRoute(client: Lavamusic): Router {
	const router = Router();
	const { homeController } = setupControllers(client);
	const { guildMiddleware } = setupMiddlewares(client);

	router.get('/', homeController.home);
	router.get('/:guildId', guildMiddleware.guildExists, homeController.guild);
	router.get('/:guildId/config', guildMiddleware.guildExists, homeController.config);
	router.get('/:guildId/channels', guildMiddleware.guildExists, homeController.channels);
	router.get('/:guildId/roles', guildMiddleware.guildExists, homeController.roles);

	router.patch('/:guildId/authmode', [
		guildMiddleware.auth,
		guildMiddleware.guildManager,
		guildMiddleware.guildExists,
		guildMiddleware.playerExists,
		guildMiddleware.channelExists,
	],
		homeController.authMode,
	);

	return router;
}	