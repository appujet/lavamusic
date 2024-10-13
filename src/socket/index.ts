import { Server } from 'socket.io';
import type Lavamusic from '@/structures/Lavamusic';
import type http from 'node:http';

export default class SocketServer {
	private readonly client: Lavamusic;
	private io!: Server;

	constructor(client: Lavamusic) {
		this.client = client;
	}

	private setupSocketServer(server: http.Server) {
		this.io = new Server(server, {
			cors: {
				origin: '*'
			}
		});
		this.setupSocketEvents();
	}

	private setupSocketEvents() {
		this.io.on('connection', (socket) => {
			console.log('A user connected');

			socket.on('disconnect', () => {
				console.log('User disconnected');
			});

			// Add more socket event handlers here
			socket.on('chat message', (msg) => {
				this.io.emit('chat message', msg);
			});
		});
	}

	public start() {
		this.setupSocketServer(this.client.api.getServer);
		this.client.logger.info(`[Socket] Server is running on port: ${this.client.api.getPort}`);
	}
}
