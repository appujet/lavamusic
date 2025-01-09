import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { UserService } from "../services/user.service";

@injectable()
export class UserController {
  constructor(@inject(UserService) private readonly userService: UserService) {}

  async status(
    req: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) {
    const { userId } = req.params;
    const data = this.userService.getUser(userId);
    return reply.status(200).send(data);
  }
  async getRecommendedTracks(req: FastifyRequest, reply: FastifyReply) {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
    const data = await this.userService.getRecommendedTracks(accessToken);
    if (!data) {
      return reply.status(404).send({ message: "Tracks not found" });
    }
    return reply.status(200).send(data);
  }
}
