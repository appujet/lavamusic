import { container } from "tsyringe";
import type { Lavamusic } from "../../structures";
import { kClient } from "../../types";

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
}
