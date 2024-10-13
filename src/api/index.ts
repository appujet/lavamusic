import http from 'node:http';
import express from 'express';
import type Lavamusic from '@/structures/Lavamusic';
import cors from 'cors';
import setupRoutes from '@/api/routes';
import { response } from '@/api/base';

export default class Api {
	private readonly client: Lavamusic;
	private app: express.Express;
	private server: http.Server;

	constructor(client: Lavamusic) {
		this.client = client;
		this.app = express();
		this.server = http.createServer(this.app);
		this.setupMiddleware();
		this.setupRoutes();
	}

	private setupMiddleware() {
		this.app.use(cors({ origin: '*' }));
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
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

	public get getServer() {
		return this.server;
	}

	public get getPort() {
		const address = this.server.address();
		if (address && typeof address !== 'string') {
			return address.port;
		}
		return null;
	}

	public start(port: number) {
		this.server.listen(port, () => {
			this.client.logger.info(`[API] Server is running on port: ${port}`);
		});
	}
}
