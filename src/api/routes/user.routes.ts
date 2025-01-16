import type { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller";
import { container } from "tsyringe";


export const userRoutes = (fastify: FastifyInstance) => {
  const controller = container.resolve(UserController);

  fastify.get("/:userId", controller.status.bind(controller));
  fastify.get(
    "/recommended-tracks",
    controller.getRecommendedTracks.bind(controller)
  );
  fastify.get("/playlist/:name", controller.getPlaylist.bind(controller));
};