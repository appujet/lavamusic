import type { FastifyInstance, FastifyRequest } from "fastify";
import { container } from "tsyringe";
import { GuildService } from "../services/guild.service";

export const guildRoutes = (fastify: FastifyInstance) => {
  const guildService = container.resolve(GuildService);
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.get("/user/@me", async (request, reply) => {
    const user = request.user as any;

    const guilds = await guildService.getUserGuilds(user.token.access_token);
    return reply.status(200).send(guilds);
  });

  fastify.get(
    "/:guildId",
    async (req: FastifyRequest<{ Params: { guildId: string } }>, reply) => {
      const user = req.user as any;
      const data = await guildService.getGuild(
        user.token.access_token,
        req.params.guildId,
      );
      return reply
        .status(data ? 200 : 404)
        .send(data || { message: "Guild not found" });
    },
  );

  fastify.get(
    "/:guildId/channels",
    async (req: FastifyRequest<{ Params: { guildId: string } }>, reply) => {
      const user = req.user as any;
      const channels = await guildService.getChannels(
        user.token.access_token,
        req.params.guildId,
      );
      return reply
        .status(channels ? 200 : 404)
        .send(channels || { message: "Channels not found" });
    },
  );

  fastify.get(
    "/:guildId/top-tracks",
    async (req: FastifyRequest<{ Params: { guildId: string } }>, reply) => {
      const user = req.user as any;
      const tracks = await guildService.getTopPlayedTracksPast24Hours(
        user.token.access_token,
        req.params.guildId,
      );
      return reply.status(tracks ? 200 : 404).send(tracks);
    },
  );

  fastify.put(
    "/:guildId/settings",
    async (
      req: FastifyRequest<{
        Params: { guildId: string };
      }>,
      reply,
    ) => {
      const user = req.user as any;
      const result = await guildService.updateGuildSettings(
        user.token.access_token,
        req.params.guildId,
        req.body,
      );
      return reply.status(200).send(result);
    },
  );
};
