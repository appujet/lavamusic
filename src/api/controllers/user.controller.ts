import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { UserService } from "../services/user.service";
import { Track } from "lavalink-client";

@injectable()
export class UserController {
  constructor(@inject(UserService) private readonly userService: UserService) {}

  async status(
    req: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply,
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
  async getPlaylist(
    req: FastifyRequest<{ Params: { name: string } }>,
    reply: FastifyReply,
  ) {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const name = req.params.name;

    if (!accessToken) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
    const data = await this.userService.getPlaylist(accessToken, name);

    if (!data) {
      return reply.status(404).send({ message: "Playlist not found" });
    }
    return reply.status(200).send(data);
  }

  async getPlaylists(req: FastifyRequest, reply: FastifyReply) {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
    const data = await this.userService.getPlaylists(accessToken);

    if (!data) {
      return reply.status(404).send({ message: "Playlists not found" });
    }
    return reply.status(200).send(data);
  }

  public async toggleLike(
    req: FastifyRequest<{ Body: { encoded: string } }>,
    reply: FastifyReply,
  ) {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
    const data = await this.userService.toggleLike(
      accessToken,
      req.body.encoded,
    );
    if (!data) {
      return reply.status(404).send({ message: "Track not found" });
    }
    return reply.status(200).send(data);
  }

  public async updatePlaylist(
    req: FastifyRequest<{
      Body: {
        playlist: { id: string; name: string; tracks: Track[] };
        type: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const data = await this.userService.updatePlaylist(
      accessToken,
      req.body.playlist.name,
      req.body.playlist.tracks,
      req.body.type as "add" | "remove" | "rename" | "create" | "delete",
      req.body.playlist.id,
    );

    if (!data) {
      return reply.status(404).send({ message: "Playlist not found" });
    }
    return reply.status(200).send(data);
  }
}
