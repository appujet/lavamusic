import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { container } from "tsyringe";
import { UserService } from "../services/user.service";

export const userRoutes = (fastify: FastifyInstance) => {
  const userService = container.resolve(UserService);
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.get(
    "/:userId",
    async (
      req: FastifyRequest<{ Params: { userId: string } }>,
      reply: FastifyReply,
    ) => {
      return reply.send(userService.getUser(req.params.userId));
    },
  );

  fastify.get("/recommended-tracks", async (req, reply) => {
    const user = req.user as any;

    const data = await userService.getRecommendedTracks(
      user.token.access_token,
    );
    return reply.send(data);
  });

  fastify.get(
    "/playlist/:name",
    async (req: FastifyRequest<{ Params: { name: string } }>, reply) => {
      const user = req.user as any;

      const accessToken = user.token.access_token;
      const data = await userService.getPlaylist(accessToken, req.params.name);
      return reply.send(data ?? { message: "Playlist not found" });
    },
  );

  fastify.get("/playlists", async (req, reply) => {
    const user = req.user as any;

    const accessToken = user.token.access_token;
    const data = await userService.getPlaylists(accessToken);
    return reply.send(data?.length ? data : { message: "Playlists not found" });
  });

  fastify.put(
    "/toggle-like",
    async (req: FastifyRequest<{ Body: { encoded: string } }>, reply) => {
      const user = req.user as any;

      const accessToken = user.token.access_token;
      const data = await userService.toggleLike(accessToken, req.body.encoded);
      return reply.send(data);
    },
  );

  fastify.put(
    "/update-playlist",
    async (
      req: FastifyRequest<{
        Body: {
          playlist: { id: string; name: string; tracks: any[] };
          type: string;
        };
      }>,
      reply,
    ) => {
      const user = req.user as any;

      const accessToken = user.token.access_token;
      const { playlist, type } = req.body;
      const data = await userService.updatePlaylist(
        accessToken,
        playlist.name,
        playlist.tracks,
        type as "add" | "remove" | "rename" | "create" | "delete",
        playlist.id,
      );
      return reply.send(data ?? { message: "Playlist not found" });
    },
  );
};
