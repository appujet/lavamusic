import { Server as SocketIOServer } from "socket.io";
import type { Lavamusic } from "..";
import { env } from "../../env";

export class SocketService {
    private client: Lavamusic
    private io!: SocketIOServer;
    constructor(client: Lavamusic) {
        this.client = client;
    }
    async init() {
        this.io = new SocketIOServer(this.client.api.fastify.server, {
            cors: {
                origin: "*",
            },
        });
        this.client.logger.info(`Socket server is running on port: ${env.API_PORT}`);
        this.setupSocketIO();
    }

    async setupSocketIO() {
        // Example event handling
        this.io.on("connection", (socket) => {
            console.log("A user connected");

            socket.on("disconnect", () => {
                console.log("A user disconnected");
            });

            // You can add other socket event handlers here
            socket.on("message", (msg) => {
                console.log("Received message:", msg);
                socket.emit("response", { message: "Message received!" });
            });
        });
    }

    getSocketIOInstance() {
        return this.io;
    }
}
