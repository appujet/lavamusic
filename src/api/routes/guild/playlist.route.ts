import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import setupControllers from '@/api/controllers/guild';
import setupMiddlewares from '@/api/middlewares';

export default function playlistRoute(client: Lavamusic): Router {
	const router = Router({ mergeParams: true });
	const { playlistController } = setupControllers(client);
	const { guildMiddleware } = setupMiddlewares(client);

	router.get('/', [guildMiddleware.optionalAuth, guildMiddleware.guildExists], playlistController.playlists);
	router.post('/', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists], playlistController.playlistCreate);

	router.get('/:playlistId', [guildMiddleware.optionalAuth, guildMiddleware.guildExists], playlistController.playlist);
	router.delete('/:playlistId', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists], playlistController.playlistDelete);

	router.post('/:playlistId', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists], playlistController.playlistAddTrack);
	router.delete('/:playlistId/:trackId', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists], playlistController.playlistRemoveTrack);

	router.get('/:playlistId/load', [
		guildMiddleware.optionalAuth,
		guildMiddleware.dj,
		guildMiddleware.guildExists,
		guildMiddleware.playerExists,
		guildMiddleware.channelExists
	], playlistController.playlistLoad);

	router.post('/:playlistId/import', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists], playlistController.playlistImport);

	return router;
}	