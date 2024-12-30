import { FastifyInstance } from "fastify";
import { BotController } from "../controllers/bot.controller";
import { container } from "tsyringe";

export const botRoutes = (fastify: FastifyInstance) => {
    const controller = container.resolve(BotController);

    fastify.get("/health-check", controller.healthCheck);
};