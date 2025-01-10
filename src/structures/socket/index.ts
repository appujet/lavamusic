import { Server } from "socket.io";
import { Lavamusic } from "..";
import { env } from "../../env";
import playerEvents from "./events/player";

export default class SocketServer {
  private readonly client: Lavamusic;
  private readonly config = {
    cors: {
      origin: env.NEXT_PUBLIC_BASE_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
  };
  public io: Server;

  constructor(client: Lavamusic) {
    this.client = client;
    this.io = new Server(client.api.fastify.server, { cors: this.config.cors });
    this.setupSocketEvents();
  }

  public start(): void {
    this.client.logger.info(
      `[Socket] Server is running on port: ${env.API_PORT}`
    );
  }

  private setupSocketEvents(): void {
    this.io.on("connection", (socket) => {
      this.client.logger.info(`[Socket] New connection: ${socket.id}`);
      // Handle socket events here
      playerEvents(socket, this.client);
    });
  }
}
