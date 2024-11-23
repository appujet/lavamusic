import type { Request, Response } from 'express';
import { response } from '@/api/base';
import type Lavamusic from '@/structures/Lavamusic';

class HomeController {
	private client: Lavamusic;

	constructor(client: Lavamusic) {
		this.client = client;
	}

	public getHome = (_req: Request, res: Response): void => {
		response.success(res, {
			message: 'TSR Music Bot Backend REST API. Copyright © TheSkinnyRat 2024.',
		});
	};

	public getStats = (_req: Request, res: Response): void => {
		response.success(res, {
			uptime: process.uptime(),
			serverCount: this.client.guilds.cache.size,
			userCount: this.client.users.cache.size,
		});
	};
}

export default HomeController;