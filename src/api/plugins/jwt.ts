
import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { env } from "../../env";

const jwtPlugin: FastifyPluginAsync = fp(async function (
  fastify: FastifyInstance
) {
  fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET || "itsasecret",
  });
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        request.user = request.user;
      } catch (error) {
        reply.send(error);
      }
    }
  );
});

export default jwtPlugin;

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}
