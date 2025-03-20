import type { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { BotService } from "../services/bot.service";

export const botRoutes = (fastify: FastifyInstance) => {
  const botService = container.resolve(BotService);

  fastify.get("/status", async (_request, reply) => {
    return reply.status(200).send(botService.getStatus());
  });

  fastify.get(
    "/top-played-tracks",
    { preHandler: [fastify.authenticate] },
    async (req, reply) => {
      const accessToken = req.headers.authorization?.split(" ")[1];
      if (!accessToken) {
        return reply.status(401).send({ message: "Unauthorized" });
      }
      const tracks = await botService.getTopPlayedTracks(accessToken);
      return reply.status(tracks ? 200 : 404).send(tracks);
    },
  );
};
