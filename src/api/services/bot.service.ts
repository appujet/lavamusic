import { container } from "tsyringe";
import type { Lavamusic } from "../../structures";
import { kClient } from "../../types";
import { Base64 } from "lavalink-client";
import { getUser } from "../lib/fetch/requests";

export class BotService {
  private client: Lavamusic;
  constructor() {
    this.client = container.resolve<Lavamusic>(kClient);
  }
  async status() {
    const data = {
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

    return data;
  }
  async getTopPlayedTracks(accessToken: string) {
    const data = await this.client.db.getBotTopPlayedTracks(
      this.client.user!.id,
    );
    const restUser = await getUser(accessToken);
    const user = await this.client.users.fetch(restUser.id).catch(() => null);
    const nodes = this.client.manager.nodeManager.leastUsedNodes();
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    const tracks = await node.decode.multipleTracks(
      data.map((t) => t.encoded) as Base64[],
      user!,
    );

    return tracks;
  }
}
