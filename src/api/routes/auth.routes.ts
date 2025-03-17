import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { discordApiService } from "../fetch/discord.js";
import { env } from "../../env.js";

export const authRoutes = (fastify: FastifyInstance) => {

  fastify.get("/auth/login", async (_request, reply) => {
    const params = new URLSearchParams({
      client_id: env.CLIENT_ID!,
      redirect_uri: `${env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
      response_type: "code",
      scope: "identify guilds",
    });
    return reply.send({
      url: `https://discord.com/oauth2/authorize?${params.toString()}`,
    });
  });

  fastify.get("/auth/callback", async (request, reply) => {
    try {
      const callbackSchema = z.object({
        code: z.string(),
        state: z.string().optional(),
      });
      const { code } = callbackSchema.parse(request.query);
      const tokenData = await discordApiService(null).getToken(code);
      const userData = await discordApiService(
        tokenData.access_token
      ).usersMe();
      const jwt = fastify.jwt.sign({
        id: userData.id,
        username: userData.username,
        avatar: userData.avatar,
        discriminator: userData.discriminator,
        token: tokenData,
      });
      return reply.send({ user: userData, jwt });
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  fastify.post("/auth/logout", async (request, reply) => {
    try {
      const token = request.headers.authorization?.split(" ")[1];
      if (token) {
        const decodedToken = fastify.jwt.decode(token) as {
          token: { access_token: string };
        };
        if (decodedToken?.token?.access_token) {
          await discordApiService(null).revokeToken(
            decodedToken.token.access_token
          );
        }
      }
      return reply.send({ message: "Logout successful" });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.get(
    "/auth/session",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        return reply.send({ user: request.user });
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );
};
