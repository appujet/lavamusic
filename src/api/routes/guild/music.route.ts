import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import setupControllers from '@/api/controllers/guild';
import setupMiddlewares from '@/api/middlewares';

export default function musicRoute(client: Lavamusic): Router {
	const router = Router({ mergeParams: true });
	const { musicController } = setupControllers(client);
	const { guildMiddleware } = setupMiddlewares(client);

	// Player management
	router.post('/player', [guildMiddleware.auth, guildMiddleware.guildExists], musicController.playerCreate);
	router.delete('/player', [guildMiddleware.auth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.playerDelete);
	router.post('/player/rejoin', [guildMiddleware.auth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.playerRejoin);

	// Track management
	router.post('/track', [guildMiddleware.auth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.track);
	router.delete('/track/:position', [guildMiddleware.auth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.trackDelete);
	router.get('/track/recommended', [guildMiddleware.auth, guildMiddleware.guildExists, guildMiddleware.playerExists], musicController.trackRecommended);

	// Player controls
	router.post('/seek', [guildMiddleware.auth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.seek);
	router.post('/pause', [guildMiddleware.auth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.pause);
	router.post('/unpause', [guildMiddleware.auth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.unpause);
	router.post('/next', [guildMiddleware.auth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.next);
	router.post('/previous', [guildMiddleware.auth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.previous);

	// Queue management
	router.post('/loop', [guildMiddleware.auth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.loop);
	router.post('/unloop', [guildMiddleware.auth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.unloop);
	router.post('/shuffle', [guildMiddleware.auth, guildMiddleware.dj, guildMiddleware.guildExists, guildMiddleware.playerExists, guildMiddleware.channelExists], musicController.shuffle);

	// Additional features
	router.get('/lyrics', [guildMiddleware.auth, guildMiddleware.guildExists, guildMiddleware.playerExists], musicController.lyrics);
	router.get('/history', [guildMiddleware.auth, guildMiddleware.guildExists], musicController.history);

	return router;
}	