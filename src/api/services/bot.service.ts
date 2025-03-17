import { container, injectable } from "tsyringe";
import { Base64 } from "lavalink-client";
import { kClient } from "../../types";
import type { Lavamusic } from "../../structures";
import { discordApiService } from "../fetch/discord";


@injectable()
export class BotService {
  private client: Lavamusic;
  constructor() {
    this.client = container.resolve<Lavamusic>(kClient);
  }

  public getStatus() {
    return {
      ping: this.client.ws.ping,
      guilds: this.client.guilds.cache.size,
      users: this.client.users.cache.size,
      channels: this.client.channels.cache.size,
      shards: this.client.shard?.count,
      memory: process.memoryUsage().rss / 1024 ** 2,
      uptime: this.client.utils.formatTime(process.uptime()),
      commands: this.client.commands.size,
      nodes: this.client.manager.nodeManager.nodes.size,
    };
  }

  public async getTopPlayedTracks(accessToken: string) {
    const data = await this.client.db.getBotTopPlayedTracks(
      this.client.user!.id
    );
    if (!data) return null;

    const restUser = await discordApiService(accessToken).usersMe();
    const user = await this.client.users.fetch(restUser.id).catch(() => null);
    if (!user) return null;

    const nodes = this.client.manager.nodeManager.leastUsedNodes();
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    if (!node) return null;

    return await node.decode.multipleTracks(
      data.map((t: any) => t.encoded) as Base64[],
      user
    );
  }
}
