import type { Guild } from "discord.js";
import type { LavalinkResponse, Node } from "shoukaku";
import { Dispatcher, type Lavamusic } from "./index.js";

export class Queue extends Map<string, Dispatcher> {
  public client: Lavamusic;

  constructor(client: Lavamusic) {
    super();
    this.client = client;
  }

  public override get(guildId: string): Dispatcher | undefined {
    return super.get(guildId);
  }

  public override set(guildId: string, dispatcher: Dispatcher): this {
    return super.set(guildId, dispatcher);
  }

  public override delete(guildId: string): boolean {
    return super.delete(guildId);
  }

  public override clear(): void {
    super.clear();
  }

  private getBestNode(): Node {
    const availableNodes = [...this.client.shoukaku.nodes.values()]
      .filter((node) => node.state === 2)
      .sort((a, b) => {
        if (a.penalties !== b.penalties) {
          return a.penalties - b.penalties;
        }
        if (a.stats.playingPlayers !== b.stats.playingPlayers) {
          return a.stats.playingPlayers - b.stats.playingPlayers;
        }
        return a.stats.cpu.systemLoad - b.stats.cpu.systemLoad;
      });

    if (availableNodes.length === 0) {
      throw new Error("No available nodes");
    }

    return availableNodes[0];
  }

  public async create(
    guild: Guild,
    voice: any,
    channel: any,
    givenNode?: Node
  ): Promise<Dispatcher> {
    if (!voice) throw new Error("No voice channel was provided");
    if (!channel) throw new Error("No text channel was provided");
    if (!guild) throw new Error("No guild was provided");

    let dispatcher = this.get(guild.id);
    if (!dispatcher) {
      let player = this.client.shoukaku.players.get(guild.id);
      if (player) {
        this.client.shoukaku.leaveVoiceChannel(guild.id);
        player.destroy();
      }
      const node = givenNode ?? this.getBestNode();
      player = await this.client.shoukaku.joinVoiceChannel({
        guildId: guild.id,
        channelId: voice.id,
        shardId: guild.shardId,
        deaf: true,
      });

// <<<<<<< main
//       dispatcher = new Dispatcher({
//         client: this.client,
//         guildId: guild.id,
//         channelId: channel.id,
//         player,
//         node,
//       });

//       this.set(guild.id, dispatcher);
//       this.client.shoukaku.emit("playerCreate" as any, dispatcher.player);
// =======
//             this.set(guild.id, dispatcher);
//             this.client.shoukaku.emit("playerCreate" as any, dispatcher.player);
//         }
//         return dispatcher;
// >>>>>>> main
    }
    return dispatcher;
  }

  public async search(query: string): Promise<LavalinkResponse | null> {
    const node = this.getBestNode();
    const searchQuery = /^https?:\/\//.test(query)
      ? query
      : `${this.client.config.searchEngine}:${query}`;
    try {
      return await node.rest.resolve(searchQuery);
    } catch (err) {
      console.error("Error during search:", err);
      return null;
    }
  }
}

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
