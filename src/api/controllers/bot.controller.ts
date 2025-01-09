import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { BotService } from "../services/bot.service";

@injectable()
export class BotController {
  constructor(@inject(BotService) private readonly botService: BotService) {}
  async status(_: FastifyRequest, reply: FastifyReply) {
    const data = await this.botService.status();
    return reply.status(200).send(data);
  }

  async getTopPlayedTracks(req: FastifyRequest, reply: FastifyReply) {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
    const data = await this.botService.getTopPlayedTracks(accessToken);
    if (!data) {
      return reply.status(404).send({ message: "Tracks not found" });
    }
    return reply.status(200).send(data);
  }
}
