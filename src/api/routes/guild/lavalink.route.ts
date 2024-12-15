import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import setupControllers from '@/api/controllers/guild';
import setupMiddlewares from '@/api/middlewares';

export default function lavalinkRoute(client: Lavamusic): Router {
	const router = Router({ mergeParams: true });
	const { lavalinkController } = setupControllers(client);
	const { guildMiddleware } = setupMiddlewares(client);

	router.get('/official', [
		guildMiddleware.optionalAuth,
		guildMiddleware.guildExists
	], lavalinkController.officialLavalinks);

	router.get('/', [
		guildMiddleware.optionalAuth,
		guildMiddleware.guildExists
	], lavalinkController.guildLavalinks);

	router.post('/', [
		guildMiddleware.auth,
		guildMiddleware.guildExists,
		guildMiddleware.dj
	], lavalinkController.createGuildLavalink);

	router.get('/:nodeId', [
		guildMiddleware.auth,
		guildMiddleware.guildExists,
		guildMiddleware.dj
	], lavalinkController.getGuildLavalink);

	router.delete('/:nodeId', [
		guildMiddleware.auth,
		guildMiddleware.guildExists,
		guildMiddleware.dj
	], lavalinkController.deleteGuildLavalink);

	router.get('/:nodeId/test', [
		guildMiddleware.auth,
		guildMiddleware.guildExists,
		guildMiddleware.dj
	], lavalinkController.testGuildLavalink);

	return router;
} 