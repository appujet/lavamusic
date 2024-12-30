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
}
