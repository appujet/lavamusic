import { Router } from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import setupControllers from '@/api/controllers/guild';
import setupMiddlewares from '@/api/middlewares';

export default function djRoute(client: Lavamusic): Router {
	const router = Router({ mergeParams: true });
	const { djController } = setupControllers(client);
	const { guildMiddleware } = setupMiddlewares(client);

	router.use('/', [guildMiddleware.auth, guildMiddleware.guildManager, guildMiddleware.guildExists]);

	router.get('/', djController.getDj);
	router.patch('/mode', djController.updateDjMode);
	router.post('/role', djController.addDjRole);
	router.delete('/role/:roleId', djController.removeDjRole);

	return router;
}	