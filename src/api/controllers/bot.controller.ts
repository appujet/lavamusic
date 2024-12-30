import { FastifyReply, FastifyRequest } from "fastify";
import { injectable } from "tsyringe";

@injectable()
export class BotController {
    async healthCheck(_: FastifyRequest, reply: FastifyReply) {
        return reply.send({ status: "OK", botStatus: "online" });
    }
}