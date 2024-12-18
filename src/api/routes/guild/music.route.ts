import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import setupControllers from '@/api/controllers/guild';
import setupMiddlewares from '@/api/middlewares';

export default function musicRoute(client: Lavamusic): Router {
	const router = Router({ mergeParams: true });
	const { musicController } = setupControllers(client);
	const { guildMiddleware } = setupMiddlewares(client);

	// search
	router.get('/search', [guildMiddleware.guildExists], musicController.search);

	// Player management
	router.post('/player', [guildMiddleware.optionalAuth, guildMiddleware.guildExists], musicController.playerCreate);
	router.delete('/player', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.playerDelete);
	router.post('/player/rejoin', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.playerRejoin);

	// Track management
	router.post('/track', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.track);
	router.delete('/track/:position', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.trackDelete);
	router.get('/track/recommended', [guildMiddleware.optionalAuth, guildMiddleware.guildExists, guildMiddleware.playerExists], musicController.trackRecommended);

	// Player controls
	router.post('/seek', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.seek);
	router.post('/pause', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.pause);
	router.post('/unpause', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.unpause);
	router.post('/next', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.next);
	router.post('/previous', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.previous);

	// Queue management
	router.post('/loop', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.loop);
	router.post('/unloop', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.unloop);
	router.post('/shuffle', [guildMiddleware.optionalAuth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.shuffle);

	// Additional features
	router.get('/lyrics', [guildMiddleware.optionalAuth, guildMiddleware.guildExists, guildMiddleware.playerExists], musicController.lyrics);
	router.get('/history', [guildMiddleware.optionalAuth, guildMiddleware.guildExists], musicController.history);

	return router;
}	