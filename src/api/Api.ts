import Fastify, {
  FastifyReply,
  FastifyRequest,
  type FastifyInstance,
} from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import { env } from "../env";
import { botRoutes } from "./routes/bot.routes";
import Logger from "../structures/Logger";
import { guildRoutes } from "./routes/guild.routes";
import { userRoutes } from "./routes/user.routes";

export class Api {
  public fastify: FastifyInstance;
  public Logger = new Logger();
  
  constructor() {
    this.fastify = Fastify({ trustProxy: true });
    this.fastify.addHook("preHandler", this.verifyJWT.bind(this));
  }
  private async verifyJWT(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      reply
        .status(401)
        .send({ error: "Unauthorized: Missing or invalid token" });
      return;
    }
  }
  async start() {
    await this.fastify.register(helmet);
    await this.fastify.register(cors, {
      origin: ["http://localhost:3000", env.NEXT_PUBLIC_BASE_URL!],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    });
    await this.fastify.register(sensible);

    /* bot routes */
    await this.fastify.register(botRoutes, {
      prefix: "/bot",
    });
    /* guild routes */
    await this.fastify.register(guildRoutes, {
      prefix: "/guild",
    });
    /* user routes */
    await this.fastify.register(userRoutes, {
      prefix: "/user",
    });

    this.fastify.get("/", (_, reply) =>
      reply.send(
        `Welcome to the Lavamusic API! Listening on port ${Number(
          env.API_PORT || 8080
        )}`
      )
    );

    this.fastify.setErrorHandler((error, _, reply) => {
      this.Logger.error(error);
      reply.status(500).send({ error: error.message });
    });
    await this.fastify.listen({
      port: Number(env.API_PORT || 8080),
      host: "0.0.0.0",
    });
    this.Logger.info(`[API] listening on port ${Number(env.API_PORT || 8080)}`);
  }
}
