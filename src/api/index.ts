import express from 'express';
import type Lavamusic from '../structures/Lavamusic';
import cors from 'cors';
import setupRoutes from './routes';
import { response } from './base';

export default class Api {
	private readonly client: Lavamusic;
	private app: express.Express;

	constructor(client: Lavamusic) {
		this.client = client;
		this.app = express();
		this.setupMiddleware();
		this.setupRoutes();
	}

	private setupMiddleware() {
		this.app.use(cors({ origin: '*' }));
		this.app.use(express.json());
	}

	private setupRoutes() {
		this.app.get('/', (_req, res) => {
			response.success(res, {
				message: `TSR Music Bot Backend REST API. Copyright © TheSkinnyRat ${new Date().getFullYear()}.`,
				availableRoutes: ['/api/v1'],
			});
		});
		this.app.use('/api/v1', setupRoutes(this.client));
	}

	public start(port: number) {
		this.app.listen(port, () => {
			this.client.logger.info(`[API] Server is running on http://localhost:${port}`);
		});
	}
}
