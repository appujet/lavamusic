import { Connectors, type NodeOption, Shoukaku } from "shoukaku";
import type { Lavamusic } from "./index.js";

export default class ShoukakuClient extends Shoukaku {
    public client: Lavamusic;
    constructor(client: Lavamusic, nodes: NodeOption[]) {
        super(new Connectors.DiscordJS(client), nodes, {
            moveOnDisconnect: false,
            resume: false,
            reconnectInterval: 30,
            reconnectTries: 2,
            restTimeout: 10000,
            userAgent: "Lavamusic (@appujet)", // don't change this
            nodeResolver: (nodes) =>
                [...nodes.values()]
                    .filter((node) => node.state === 2)
                    .sort((a, b) => a.penalties - b.penalties)
                    .shift(),
        });

    this.client = client;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.on("ready", (name, reconnected) => {
      if (!reconnected) {
        logger.info(`Node ${name} is ready`);
      }
      this.reconnect247Players().catch((error) => {
        logger.error(`Failed to reconnect 24/7 players: ${error.message}`);
      });
    });

    this.on("error", (name, error) => {
      logger.error(`Node ${name} encountered an error: ${error.message}`);
    });

    this.on("close", async (name, code, reason) => {
      logger.warn(`Node ${name} closed. Code: ${code}, Reason: ${reason}`);
      await this.disconnectPlayersOnNodeFailure(name).catch((error) => {
        logger.error(`Failed to disconnect players: ${error.message}`);
      });
    });

    this.on("disconnect", async (name, count) => {
      logger.warn(`Node ${name} disconnected. Attempt count: ${count}`);
      await this.disconnectPlayersOnNodeFailure(name).catch((error) => {
        logger.error(`Failed to disconnect players: ${error.message}`);
      });
    });
  }

  private static getBestNode(nodes: Map<string, any>) {
    const bestNode = [...nodes.values()]
      .filter((node) => node.state === 2)
      .sort((a, b) => {
        if (a.penalties !== b.penalties) return a.penalties - b.penalties;
        if (a.stats.playingPlayers !== b.stats.playingPlayers)
          return a.stats.playingPlayers - b.stats.playingPlayers;
        return a.stats.ping - b.stats.ping;
      })
      .shift();

    return bestNode;
  }

  private async disconnectPlayersOnNodeFailure(nodeName: string) {
    for (const [guildId, player] of this.client.queue.entries()) {
      if (player.node.name === nodeName) {
        try {
          await player.destroy();
          this.client.queue.delete(guildId);
          logger.info(
            `Disconnected player in guild ${guildId} due to node failure`
          );
        } catch (error) {
          logger.error(
            `Failed to disconnect player in guild ${guildId}: ${error.message}`
          );
        }
      }
    }
  }

  private async reconnect247Players() {
    const data = await this.client.db.get_247();
    if (!data) return;

    const dataArray = Array.isArray(data) ? data : [data];

    for (const entry of dataArray) {
      const guild = this.client.guilds.cache.get(entry.guildId);
      if (!guild) continue;

      const channel = guild.channels.cache.get(entry.textId);
      const vc = guild.channels.cache.get(entry.voiceId);

      if (channel && vc) {
        const existingPlayer = this.client.queue.get(guild.id);
        if (existingPlayer) {
          logger.info(`24/7 player already exists in guild ${guild.id}`);
        } else {
          try {
            await this.client.queue.create(guild, vc, channel);
            logger.info(`Reconnected 24/7 player in guild ${guild.id}`);
          } catch (error) {
            if (!error.message.includes("existing connection")) {
              logger.error(
                `Failed to reconnect 24/7 player in guild ${guild.id}: ${error.message}`
              );
            }
          }
        }
      }
    }
  }
}
