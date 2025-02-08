import type { FastifyInstance } from "fastify";
import { BotController } from "../controllers/bot.controller";
import { container } from "tsyringe";

export const botRoutes = (fastify: FastifyInstance) => {
  const controller = container.resolve(BotController);

  fastify.get("/status", controller.status.bind(controller));

  fastify.get(
    "/top-played-tracks",
    controller.getTopPlayedTracks.bind(controller),
  );
};
