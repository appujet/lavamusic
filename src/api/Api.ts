import Fastify, { type FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import { env } from "../env";
import { botRoutes } from "./routes/bot.routes";
import Logger from "../structures/Logger";

export class Api {
  public fastify: FastifyInstance;
  public Logger = new Logger();
  constructor() {
    this.fastify = Fastify({ trustProxy: true });
  }
  async init() {
    await this.fastify.register(helmet);
    await this.fastify.register(cors, {
      origin: "*",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    });
    await this.fastify.register(sensible);

    /* bot routes */
    await this.fastify.register(botRoutes, {
      prefix: "/bot",
    });

    this.fastify.get("/", (_, reply) =>
      reply.send(
        `Welcome to the Lavamusic API! Listening on port ${Number(
          env.API_PORT || 8080,
        )}`,
      ),
    );

    await this.fastify.listen({
      port: Number(env.API_PORT || 8080),
    });
    this.Logger.info(`API listening on port ${Number(env.API_PORT || 8080)}`);
  }
}
