import type { LavalinkNode } from "lavalink-client";
import { Event, type Lavamusic } from "../../structures/index";
import { sendLog } from "../../utils/BotLog";

export default class Disconnect extends Event {
  constructor(client: Lavamusic, file: string) {
    super(client, file, {
      name: "disconnect",
    });
  }

  public async run(node: LavalinkNode, reason?: Error | string): Promise<void> {
    let reasonText: string;
    if (reason instanceof Error) {
      reasonText = reason.message;
    } else if (typeof reason === "string") {
      reasonText = reason;
    } else if (reason && typeof reason === "object") {
      try {
        reasonText = JSON.stringify(reason);
      } catch {
        reasonText = "Unknown object reason";
      }
    } else {
      reasonText = "Unknown reason";
    }
    this.client.logger.warn(`Node ${node.id} disconnected: ${reasonText}`);

    // Log the disconnection
    sendLog(this.client, `Node ${node.id} disconnected: ${reasonText}`, "warn");

    // Get players on the disconnected node
    const playersOnNode = this.client.manager.players.filter(
      (player) => player.node.options.id === node.id,
    );

    if (playersOnNode.size > 0) {
      const autoMoveEnabled = !!this.client.manager.options.autoMove;
      this.client.logger.info(
        `Node ${node.id} disconnect: ${playersOnNode.size} player(s) affected. Auto-move is ${autoMoveEnabled ? "enabled" : "disabled"}.`,
      );

      // Log which servers are affected
      const affectedGuilds = Array.from(playersOnNode.values()).map(
        (p) => p.guildId,
      );
      sendLog(
        this.client,
        `Players in ${affectedGuilds.length} guild(s) affected by node ${node.id} disconnect. Auto-move: ${autoMoveEnabled ? "enabled" : "disabled"}`,
        "info",
      );
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
 * https://discord.gg/YQsGbTwPBx
 */
