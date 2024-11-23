import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import setupControllers from '@/api/controllers';
import setupMiddlewares from '@/api/middlewares';

export default function discordRoute(client: Lavamusic): Router {
	const router = Router();
	const { discordMiddleware } = setupMiddlewares(client);
	const { discordController } = setupControllers(client);

	router.get('/', discordController.home);
	router.post('/login/uri', discordController.loginUri);

	router.post('/token', discordController.token);
	router.post('/token/refresh', discordController.tokenRefresh);
	router.post('/token/revoke', discordController.tokenRevoke);

	router.get('/users/@me', [discordMiddleware.isAccessTokenProvided], discordController.usersMe);
	router.get('/users/@me/guilds', [discordMiddleware.isAccessTokenProvided], discordController.usersMeGuilds);

	return router;
}